import { ListView } from 'react-native'
import merge from '../../util/merge'
import { getNextMonth, getPreviousMonth } from '../../util/date'
import groupTransactions, { sortTransactions } from './groupTransactions'
import { getTransactions } from '../../api'
import * as localStorage from '../../localStorage'

const isValidList = (transactionList) => transactionList !== undefined && transactionList !== null && transactionList.length > 0
const formatDate = (stringDate) => (new Date(stringDate)).toJSON()
const storageKey = localStorage.storageKeys.TRANSACTION_KEY

const initDate = new Date()

const initialState = {
  selectedMonth: {
    month: initDate.getMonth(),
    year: initDate.getFullYear()
  },
  loadingTransactions: true,
  loadingMoreTransactions: false,
  transactions: [],
  refreshing: false,
  noMoreTransactionsToLoad: false,
  dataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
}

export const nextMonth = () => ({
  type: 'transaction/SHOW_NEXT_MONTH'
})

export const previousMonth = () => ({
  type: 'transaction/SHOW_PREVIOUS_MONTH'
})

const noMoreTransactions = () => ({
  type: 'transaction/NO_MORE_TRANSACTIONS'
})

const transactionsReceived = (transactions) => ({
  type: 'transaction/TRANSACTIONS_RECEIVED',
  transactions
})

export const loadingMore = () => ({
  type: 'transaction/LOADING_MORE_TRANSACTIONS'
})

const updateRefreshing = () => ({
  type: 'transaction/UPDATE_REFRESHING'
})

export const loadTransactionsBefore = (lastDate, excludeIdList) =>
  (dispatch, getState) => {
    dispatch(loadingMore())
    getTransactions(getState().login.sessionToken, dispatch, {
      datePeriod: ',' + formatDate(lastDate),
      excludedIds: excludeIdList
    }).then(transactions => dispatch(transactions.length === 0 ? noMoreTransactions() : transactionsReceived(transactions)))
  }

export const loadTransactionsAfter = (firstDate, excludeIdList) =>
  (dispatch, getState) => {
    dispatch(updateRefreshing())
    getTransactions(getState().login.sessionToken, dispatch,{
      datePeriod: formatDate(firstDate) + ',',
      excludedIds: excludeIdList
    }).then(transactions => dispatch(transactionsReceived(transactions)))
  }

export const loadTransactions = () =>
    (dispatch) =>
        localStorage.get(storageKey)
          .then(storedTransactions =>
              dispatch(isValidList(storedTransactions)
                ? transactionsReceived(storedTransactions)
                : loadTransactionsFromApi()))

export const clearTransactions = () => ({
  type: 'transaction/CLEAR_TRANSACTIONS'
})

const loadTransactionsFromApi = () =>
    (dispatch, getState) =>
      getTransactions(getState().login.sessionToken, dispatch)
        .then(transactions => dispatch(transactionsReceived(transactions)))
        .catch(console.error)

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'transaction/TRANSACTIONS_RECEIVED':
      const mergedTransactions = [...state.transactions, ...action.transactions]
      const sortedTransactions = sortTransactions(mergedTransactions)
      localStorage.save(storageKey, sortedTransactions)
      const grouped = groupTransactions(sortedTransactions)
      state = merge(state, {
        loadingTransactions: false,
        dataSource: state.dataSource.cloneWithRowsAndSections(grouped.groups, grouped.groupOrder),
        transactions: sortedTransactions,
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
    case 'transaction/SHOW_NEXT_MONTH':
      state = merge(state, {
        selectedMonth: getNextMonth(state.selectedMonth)
      })
      break
    case 'transaction/SHOW_PREVIOUS_MONTH':
      state = merge(state, {
        selectedMonth: getPreviousMonth(state.selectedMonth)
      })
      break
  }
  return state
}

export default reducer
