import { ListView } from 'react-native'
import merge from '../../util/merge'
import * as date from '../../util/date'
import { groupTransactionsByDate, groupTransactionsByBusiness, calculateMonthlyTotalSpent, filterTransactions, sortTransactions } from '../../util/transaction'
import { getTransactions, PAGE_SIZE } from '../../api'
import { findTransactionsByDate } from '../../util/transaction'
import moment from 'moment'
import { selectAndLoadBusiness } from './business'

const last = (arr) => arr.length > 0 ? arr[arr.length - 1] : undefined

const initialState = {
  selectedMonth: undefined,
  loadingTransactions: true,
  loadingMoreTransactions: false,
  transactions: [],
  refreshing: false,
  noMoreTransactionsToLoad: false,
  monthlyTotalSpent: {},
  transactionsDataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a !== b
  }),
  traderDataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a !== b
  })
}

const selectMonth = month => ({
  type: 'transaction/SELECT_MONTH',
  month
})

const noMoreTransactions = () => ({
  type: 'transaction/NO_MORE_TRANSACTIONS'
})

const transactionsReceived = transactions => ({
  type: 'transaction/TRANSACTIONS_RECEIVED',
  transactions
})

export const loadingMore = () => ({
  type: 'transaction/LOADING_MORE_TRANSACTIONS'
})

const updateRefreshing = () => ({
  type: 'transaction/UPDATE_REFRESHING'
})

export const resetTransactions = () => ({
  type: 'transaction/RESET_TRANSACTIONS'
})

export const setSelectedMonth = (newSelectedMonth) =>
  (dispatch, getState) => {
    newSelectedMonth = newSelectedMonth ? newSelectedMonth : date.currentMonth()
    const state = getState().transaction
    const noMoreTransactionsToLoad = state.noMoreTransactionsToLoad
    const earliestTransaction = last(state.transactions)
    const earliestTransactionDate = earliestTransaction ? earliestTransaction.date : moment()

    const transactions = state.transactions
    const loadingMoreTransactions = state.loadingMoreTransactions
    if(!loadingMoreTransactions && !noMoreTransactionsToLoad && date.compare(newSelectedMonth, earliestTransactionDate) < 0) {
      const excludeIdList = findTransactionsByDate(transactions, earliestTransactionDate)
      dispatch(loadTransactionsBefore(earliestTransactionDate, excludeIdList, newSelectedMonth))
    }
    dispatch(selectMonth(newSelectedMonth))
  }

// excludeIdList - required to prevent fetching the transactions we have already fetched.
//                 Using maximumDate in the cyclos call will include transactions with the maximumDate or earlier,
//                 so we need to exlcude the transactions we have that have the date = maximumDate
// loadToTarget  - the minimum date we are attempting to load to. Each time we fetch a page of transactions we check if
//                 loadToTarget has been reached yet, and if not we make a request for another page.
const loadTransactionsBefore = (maximumDate, excludeIdList, loadToTarget = null) =>
  (dispatch) => {
    dispatch(loadingMore())
    getTransactions(dispatch, {
      datePeriod: ',' + date.convert.stringToJson(maximumDate),
      excludedIds: excludeIdList
    }, tr => !loadToTarget || date.compare(loadToTarget, last(tr).date) >= 0)
      .then(transactions => {
        if (transactions.length === 0 || (transactions.length % PAGE_SIZE !== 0)) {
        dispatch(noMoreTransactions())
      }
      if (transactions.length !== 0) {
        dispatch(transactionsReceived(transactions))
      }
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
      dispatch(refreshTraderTransactions())
    })
  }

const refreshTraderTransactions = () => (dispatch, getState) =>
  dispatch(selectAndLoadBusiness(getState().business.selectedBusinessId)) // refresh trader transaction list

const newDataSources = (previousTransactionsDataSource, previousTradersDataSource, sortedTransactions, selectedMonth) => {
  const filteredTransactions = filterTransactions(sortedTransactions, selectedMonth)
  const grouped = groupTransactionsByDate(filteredTransactions)
  const tradersData = groupTransactionsByBusiness(filteredTransactions)
  return {
    transactionsDataSource: previousTransactionsDataSource.cloneWithRowsAndSections(grouped.groups, grouped.groupOrder),
    traderDataSource: previousTradersDataSource.cloneWithRows(tradersData),
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'transaction/TRANSACTIONS_RECEIVED':
      const mergedTransactions = [...state.transactions, ...action.transactions]
      const sortedTransactions = sortTransactions(mergedTransactions)
      const monthlyTotalSpent = calculateMonthlyTotalSpent(state.monthlyTotalSpent, action.transactions)
      state = merge(state, newDataSources(state.transactionsDataSource, state.traderDataSource, sortedTransactions, state.selectedMonth), {
        monthlyTotalSpent: monthlyTotalSpent,
          transactions: sortedTransactions,
          loadingTransactions: false,
          loadingMoreTransactions: false,
          refreshing: false
      })
      break
    case 'transaction/LOADING_MORE_TRANSACTIONS':
      state = merge(state, {
        loadingMoreTransactions: true
      })
      break
    case 'transaction/UPDATE_REFRESHING':
      state = merge(state, {
        refreshing: true
      })
      break
    case 'transaction/NO_MORE_TRANSACTIONS':
      state = merge(state, {
        loadingTransactions: false,
        loadingMoreTransactions: false,
        noMoreTransactionsToLoad: true
      })
      break
    case 'transaction/SELECT_MONTH':
      state = merge(state, newDataSources(state.transactionsDataSource, state.traderDataSource, state.transactions, action.month), {
        selectedMonth: action.month,
        loadingTransactions: state.loadingTransactions && state.transactions.length === 0,
      })
      break
    case 'transaction/RESET_TRANSACTIONS':
      state = merge(state, {
        selectedMonth: date.currentMonth(),
        transactions: [],
        noMoreTransactionsToLoad: false,
        monthlyTotalSpent: {},
        transactionsDataSource: state.transactionsDataSource.cloneWithRowsAndSections({}, []),
        traderDataSource: state.traderDataSource.cloneWithRows([]),
      })
      break
  }
  return state
}

export default reducer
