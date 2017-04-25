import { ListView } from 'react-native'
import merge from '../../util/merge'
import _ from 'lodash'
import { calculateMonthlyTotalSpent,
  sortTransactions, findTransactionsByDate } from '../../util/transaction'
import { addColorCodes } from '../../util/business'
import { getTransactions, getAccountBalance } from '../../api/accounts'
import { updateStatus, unknownError } from './statusMessage'
import { loggedOut, openLoginForm } from './login'
import { UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { accountBalanceReceived } from './account'

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
  }),
  spendingListRef: null
}

export const selectMonth = (monthIndex) => (dispatch) => {
    dispatch ({
      type: 'transaction/SELECT_MONTH',
      monthIndex
    })
  }

export const registerSpengingList = (ref) => ({
  type: 'transaction/REGISTER_SPENDING_LIST',
  ref
})

const transactionsReceived = (transactions, keepOldTransactions) => ({
  type: 'transaction/TRANSACTIONS_RECEIVED',
  transactions,
  keepOldTransactions
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
  dispatch(failedToLoadTransactions())
  if (err.type === UNAUTHORIZED_ACCESS) {
    dispatch(updateStatus('Your session has expired'))
    setTimeout(() => {
      dispatch(loggedOut())
      dispatch(openLoginForm(true))
    }, 500)
  } else {
    dispatch(unknownError(err))
  }
}

const loadTransactionsSuccessCriteria = (transactions) =>
  (result, pageNo) => pageNo > 6
    || transactions.find(t => t.id === result[result.length - 1].id)

export const loadTransactions = (keepOldTransactions) =>
  (dispatch, getState) => {
    dispatch(updateLoadingTransactions())
    getTransactions(dispatch, {}, loadTransactionsSuccessCriteria(getState().transaction.transactions))
      .then(transactions => {
        dispatch(transactionsReceived(transactions, keepOldTransactions))
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
      dispatch(transactionsReceived(transactions, true))
      getAccountBalance(dispatch)
        .then(account => dispatch(accountBalanceReceived(account)))
    })
    .catch(handleError(dispatch))
  }

const filterTransactionsByMonth = (dataSource, selectedMonth) => {
  return dataSource.cloneWithRowsAndSections(selectedMonth.transactions.groups, selectedMonth.transactions.groupOrder)
}

// filter transactions based on the current transaction state
const filterTransactionsByMonthIndex = (state, monthIndex) =>
  state.monthlyTotalSpent.length > 0
    ? filterTransactionsByMonth(state.transactionsDataSource, state.monthlyTotalSpent[monthIndex])
    : state.transactionsDataSource.cloneWithRowsAndSections({}, [])

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navigation/NAVIGATE_TO_TAB':
      if (action.tabIndex === 1) {
        state = merge(state, {
          selectedMonthIndex: lastIndex(state.monthlyTotalSpent),
          transactionsDataSource: filterTransactionsByMonthIndex(state, lastIndex(state.monthlyTotalSpent)),
        })
      }
      break

    case 'transaction/TRANSACTIONS_RECEIVED':
      const mergedTransactions = action.keepOldTransactions
        ? _.uniqBy([...state.transactions, ...action.transactions], 'transactionNumber')
        : action.transactions
      const sortedTransactions = sortTransactions(mergedTransactions)
      if (sortedTransactions.length > 500) {
        sortedTransactions.length = 500
      }
      const coloredSortedTransactions = addColorCodes(sortedTransactions)
      const monthlyTotalSpent = calculateMonthlyTotalSpent(coloredSortedTransactions)
      const selectedMonthIndex = lastIndex(monthlyTotalSpent)
      state = merge(state, {
        loadingTransactions: false,
        refreshing: false,
        monthlyTotalSpent,
        selectedMonthIndex,
        transactions: coloredSortedTransactions,
        transactionsDataSource: filterTransactionsByMonth(
          state.transactionsDataSource, monthlyTotalSpent[selectedMonthIndex])
      })
      break

    case 'transaction/LOADING_TRANSACTIONS':
      state = merge(state, { loadingTransactions: true })
      break

    case 'transaction/UPDATE_REFRESHING':
      state = merge(state, { refreshing: true })
      break

    case 'transaction/SELECT_MONTH':
      if (state.selectedMonthIndex !== action.monthIndex) {
        state = merge(state, {
          selectedMonthIndex: action.monthIndex,
          transactionsDataSource: filterTransactionsByMonthIndex(state, action.monthIndex),
        })
      } else { // tapping the same month should scroll to the top
        state = merge(state, {
        })
      }
      state.spendingListRef && state.spendingListRef.scrollTo({ y: 0, animated: false })
      break

    case 'transaction/RESET_TRANSACTIONS':
      state = initialState
      break

    case 'transaction/REGISTER_SPENDING_LIST':
      state = merge(state, { spendingListRef: action.ref })
      break

    case 'transaction/FAILED_TO_LOAD':
      state = merge(state, {
        loadingTransactions: false,
        refreshing: false
      })
  }
  return state
}

export default reducer
