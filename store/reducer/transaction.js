import { ListView } from 'react-native'
import merge from '../../util/merge'
import * as date from '../../util/date'
import { groupTransactionsByDate, groupTransactionsByBusiness, calculateMonthlyTotalSpent, filterTransactions, sortTransactions } from '../../util/transaction'
import { getTransactions, PAGE_SIZE } from '../../api'
import * as localStorage from '../../localStorage'
import { findTransactionsByDate } from '../../util/transaction'
import moment from 'moment'

const isValidList = (transactionList) => transactionList !== undefined && transactionList !== null && transactionList.length > 0
const storageKey = localStorage.storageKeys.TRANSACTION_KEY
const last = (arr) => arr.length > 0 ? arr[arr.length - 1] : undefined

const initialState = {
  selectedMonth: date.currentMonth(),
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
    rowHasChanged: (a, b) => a.id !== b.id
  }),
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

export const clearTransactions = () => ({
  type: 'transaction/CLEAR_TRANSACTIONS'
})

export const setSelectedMonth = (newSelectedMonth) =>
  (dispatch, getState) => {
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
  (dispatch, getState) => {
    dispatch(loadingMore())
    getTransactions(getState().login.sessionToken, dispatch, {
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

export const loadTransactionsAfter = (firstDate, excludeIdList) =>
  (dispatch, getState) => {
    dispatch(updateRefreshing())
    getTransactions(getState().login.sessionToken, dispatch,{
      datePeriod: date.convert.stringToJson(firstDate) + ',',
      excludedIds: excludeIdList
    }).then(transactions => dispatch(transactionsReceived(transactions)))
  }

export const loadInitialTransactions = () =>
    (dispatch, getState) =>
        localStorage.get(storageKey)
          .then(storedTransactions =>
              dispatch(isValidList(storedTransactions)
                ? transactionsReceived(storedTransactions)
                : loadTransactionsBefore(new Date().toString(), [], date.previousMonth(getState().transaction.selectedMonth))))

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
      localStorage.save(storageKey, sortedTransactions)
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
    case 'transaction/CLEAR_TRANSACTIONS':
      localStorage.remove(storageKey)
      state = merge(initialState)
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
      })
      break
  }
  return state
}

export default reducer
