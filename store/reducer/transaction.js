import { ListView } from 'react-native'
import merge from '../../util/merge'
import * as date from '../../util/date'
import { groupTransactionsByDate, calculateMonthlyTotalSpent, filterTransactions, sortTransactions } from '../../util/transaction'
import { getTransactions } from '../../api'
import { findTransactionsByDate } from '../../util/transaction'

const initialState = {
  refreshing: false,
  selectedMonth: undefined,
  loadingTransactions: true,
  transactions: [],
  monthlyTotalSpent: {},
  transactionsDataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
}

export const selectMonth = month => ({
  type: 'transaction/SELECT_MONTH',
  month
})

const transactionsReceived = transactions => ({
  type: 'transaction/TRANSACTIONS_RECEIVED',
  transactions
})

export const updateLoadingTransactions = (loading) => ({
  type: 'transaction/LOADING_TRANSACTIONS',
  loading
})

const updateRefreshing = () => ({
  type: 'transaction/UPDATE_REFRESHING'
})

export const resetTransactions = () => ({
  type: 'transaction/RESET_TRANSACTIONS'
})

export const loadTransactions = () =>
  (dispatch) => {
    dispatch(updateLoadingTransactions(true))
    // fetch up to 10 pages of transactions
    getTransactions(dispatch, {}, (result, pageNo) => pageNo > 10)
      .then(transactions => {
        dispatch(transactionsReceived(transactions))
        dispatch(updateLoadingTransactions(false))
      })
  }

export const loadTransactionsAfterLast = () =>
  (dispatch, getState) => {
    const transactions = getState().transaction.transactions
    const firstDate = transactions[0].date
    const excludeIdList = findTransactionsByDate(transactions, firstDate)
    dispatch(updateRefreshing())
    getTransactions(dispatch,{
      datePeriod: date.convert.stringToJson(firstDate) + ',',
      excludedIds: excludeIdList
    }).then(transactions => {
      dispatch(transactionsReceived(transactions))
    })
  }

const filterTransactionsByMonth = (dataSource, sortedTransactions, selectedMonth) => {
  const filteredTransactions = filterTransactions(sortedTransactions, selectedMonth)
  const grouped = groupTransactionsByDate(filteredTransactions)
  return dataSource.cloneWithRowsAndSections(grouped.groups, grouped.groupOrder)
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'transaction/TRANSACTIONS_RECEIVED':
      const mergedTransactions = [...state.transactions, ...action.transactions]
      const sortedTransactions = sortTransactions(mergedTransactions)
      const monthlyTotalSpent = calculateMonthlyTotalSpent(state.monthlyTotalSpent, action.transactions)
      state = merge(state, {
        monthlyTotalSpent: monthlyTotalSpent,
        transactions: sortedTransactions,
        transactionsDataSource: filterTransactionsByMonth(state.transactionsDataSource, sortedTransactions, state.selectedMonth)
      })
      break
    case 'transaction/LOADING_TRANSACTIONS':
      state = merge(state, {
        loadingTransactions: action.loading
      })
      break
    case 'transaction/SELECT_MONTH':
      state = merge(state, {
        selectedMonth: action.month,
        loadingTransactions: state.loadingTransactions && state.transactions.length === 0,
        transactionsDataSource: filterTransactionsByMonth(state.transactionsDataSource, state.transactions, action.month)
      })
      break
    case 'transaction/RESET_TRANSACTIONS':
      state = merge(state, {
        selectedMonth: date.currentMonth(),
        transactions: [],
        monthlyTotalSpent: {},
        transactionsDataSource: state.transactionsDataSource.cloneWithRowsAndSections({}, [])
      })
      break
  }
  return state
}

export default reducer
