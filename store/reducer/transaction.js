import { ListView } from 'react-native'
import merge from '../../util/merge'
import _ from 'lodash'
import { groupTransactionsByDate, calculateMonthlyTotalSpent, filterTransactions, sortTransactions } from '../../util/transaction'
import { getTransactions } from '../../api/accounts'
import { findTransactionsByDate } from '../../util/transaction'
import { updateStatus } from './statusMessage'
import { loggedOut, openLoginForm } from './login'
import { UNAUTHORIZED_ACCESS } from '../../api/api'
import color from '../../util/colors'

const lastIndex = (arr) => arr.length - 1

const initialState = {
  refreshing: false,
  selectedMonthIndex: 0,
  loadingTransactions: false,
  transactions: [],
  monthlyTotalSpent: [],
  transactionsDataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
}

export const selectMonth = monthIndex => ({
  type: 'transaction/SELECT_MONTH',
  monthIndex
})

const transactionsReceived = transactions => ({
  type: 'transaction/TRANSACTIONS_RECEIVED',
  transactions
})

export const updateLoadingTransactions = () => ({
  type: 'transaction/LOADING_TRANSACTIONS',
})

const updateRefreshing = () => ({
  type: 'transaction/UPDATE_REFRESHING'
})

export const resetTransactions = () => ({
  type: 'transaction/RESET_TRANSACTIONS'
})

const failedToLoadTransactions = () => ({
  type: 'transaction/FAILED_TO_LOAD'
})

const handleError = (dispatch) => (err) => {
  if (err.type === UNAUTHORIZED_ACCESS) {
    dispatch(loggedOut())
    dispatch(updateStatus('Your session has expired'))
    dispatch(openLoginForm(true))
  } else {
    dispatch(updateStatus('Unknown error', color.orange))
    dispatch(failedToLoadTransactions())
  }
}

export const loadTransactions = () =>
  (dispatch) => {
    dispatch(updateLoadingTransactions())
    // fetch up to 10 pages of transactions
    getTransactions(dispatch, {}, (result, pageNo) => pageNo > 10)
      .then(transactions => {
        dispatch(transactionsReceived(transactions))
      })
      .catch(handleError(dispatch))
    }

export const loadMoreTransactions = () =>
  (dispatch, getState) => {
    const transactions = getState().transaction.transactions
    const firstDate = transactions.length > 0 ? new Date(transactions[0].date) : new Date()
    const excludeIdList = findTransactionsByDate(transactions, firstDate)
    dispatch(updateRefreshing())
    getTransactions(dispatch,{
      datePeriod: firstDate.toJSON() + ',',
      excludedIds: excludeIdList
    })
    .then(transactions => {
      dispatch(transactionsReceived(transactions))
    })
    .catch(handleError(dispatch))
  }

const filterTransactionsByMonth = (dataSource, sortedTransactions, selectedMonth) => {
  const filteredTransactions = filterTransactions(sortedTransactions, selectedMonth)
  const grouped = groupTransactionsByDate(filteredTransactions)
  return dataSource.cloneWithRowsAndSections(grouped.groups, grouped.groupOrder)
}

// filter transactions based on the current transaction state
const filterTransactionsByMonthIndex = (state, monthIndex) =>
  state.monthlyTotalSpent.length > 0
    ? filterTransactionsByMonth(state.transactionsDataSource,
        state.transactions, state.monthlyTotalSpent[monthIndex].month)
    : state.transactionsDataSource.cloneWithRowsAndSections({}, [])

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navigation/NAVIGATE_TO_TAB':
      if (action.tabIndex === 1) {
        state = merge(state, {
          selectedMonthIndex: lastIndex(state.monthlyTotalSpent),
          transactionsDataSource: filterTransactionsByMonthIndex(state, lastIndex(state.monthlyTotalSpent))
        })
      }
      break
    case 'transaction/TRANSACTIONS_RECEIVED':
      const mergedTransactions = _.uniqBy([...state.transactions, ...action.transactions], 'transactionNumber')
      const sortedTransactions = sortTransactions(mergedTransactions)
      const monthlyTotalSpent = calculateMonthlyTotalSpent(sortedTransactions)
      const selectedMonthIndex = lastIndex(monthlyTotalSpent)
      state = merge(state, {
        loadingTransactions: false,
        refreshing: false,
        monthlyTotalSpent,
        selectedMonthIndex,
        transactions: sortedTransactions,
        transactionsDataSource: filterTransactionsByMonth(state.transactionsDataSource,
                                    sortedTransactions, monthlyTotalSpent[selectedMonthIndex].month)
      })
      break
    case 'transaction/LOADING_TRANSACTIONS':
      state = merge(state, {
        loadingTransactions: true
      })
      break
    case 'transaction/UPDATE_REFRESHING':
      state = merge(state, {
        refreshing: true
      })
      break
    case 'transaction/SELECT_MONTH':
      //BUG: the carousel control allows you to 'select' non existent pages
      const index = Math.min(action.monthIndex, lastIndex(state.monthlyTotalSpent))
      state = merge(state, {
        selectedMonthIndex: index,
        transactionsDataSource: filterTransactionsByMonthIndex(state, index)
      })
      break
    case 'transaction/RESET_TRANSACTIONS':
      state = initialState
      break
    case 'transaction/FAILED_TO_LOAD':
      state = merge(state, {
        loadingTransactions: false,
        refreshing: false
      })
      break
  }
  return state
}

export default reducer
