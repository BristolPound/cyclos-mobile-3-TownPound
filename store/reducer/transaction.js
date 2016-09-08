import { ListView } from 'react-native'
import merge from '../../util/merge'
import groupTransactions, { sortTransactions } from './groupTransactions'
import { getTransactions, getAccount, PAGE_SIZE } from '../../api'
import * as localStorage from '../../localStorage'

const isValidList = (transactionList) => transactionList !== undefined && transactionList !== null && transactionList.length > 0
const formatDate = (stringDate) => (new Date(stringDate)).toJSON()
const storageKey = localStorage.storageKeys.TRANSACTION_KEY

const initialState = {
  loadingTransactions: true,
  loadingMoreTransactions: false,
  loadingBalance: true,
  transactions: [],
  refreshing: false,
  noMoreTransactionsToLoad: false,
  dataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
}

export const accountDetailsReceived = (account) => ({
  type: 'account/ACCOUNT_DETAILS_RECEIVED',
  account
})

const transactionsReceived = (transactions, addToEnd) => ({
  type: 'account/TRANSACTIONS_RECEIVED',
  transactions,
  addToEnd
})

export const loadingMore = () => ({
  type: 'account/LOADING_MORE_TRANSACTIONS'
})

const updateRefreshing = () => ({
  type: 'account/UPDATE_REFRESHING'
})

export const loadTransactionsBefore = (lastDate, excludeIdList) =>
  (dispatch, getState) => {
    dispatch(loadingMore())
    getTransactions(getState().login.sessionToken, dispatch, {
      datePeriod: ',' + formatDate(lastDate),
      excludedIds: excludeIdList
    }).then(transactions => dispatch(transactionsReceived(transactions, true)))
  }

export const loadTransactionsAfter = (firstDate, excludeIdList) =>
  (dispatch, getState) => {
    dispatch(updateRefreshing())
    getTransactions(getState().login.sessionToken, dispatch,{
      datePeriod: formatDate(firstDate) + ',',
      excludedIds: excludeIdList
    }).then(transactions => dispatch(transactionsReceived(transactions, false)))
  }

export const loadTransactions = () =>
    (dispatch, getState) => {
        getAccount(getState().login.sessionToken, dispatch)
          .then((json) => {
            return json[0].status.balance // get first item in list for now
          })
          .then(account => dispatch(accountDetailsReceived(account)))
          .catch(console.error)

        localStorage.get(storageKey)
          .then(storedTransactions =>
              dispatch(isValidList(storedTransactions)
                ? transactionsReceived(storedTransactions)
                : loadTransactionsFromApi()))
    }

export const clearTransactions = () => ({
  type: 'account/CLEAR_TRANSACTIONS'
})

const loadTransactionsFromApi = () =>
    (dispatch, getState) =>
      getTransactions(getState().login.sessionToken, dispatch)
        .then(transactions => dispatch(transactionsReceived(transactions, true)))
        .catch(console.error)

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'account/ACCOUNT_DETAILS_RECEIVED':
      state = merge(state, {
        balance: action.account,
        loadingBalance: false
      })
      break
    case 'account/TRANSACTIONS_RECEIVED':
      const mergedTransactions = [...state.transactions, ...action.transactions]
      const sortedTransactions = sortTransactions(mergedTransactions)
      localStorage.save(storageKey, sortedTransactions)
      const grouped = groupTransactions(sortedTransactions)
      state = merge(state, {
        loadingTransactions: false,
        dataSource: state.dataSource.cloneWithRowsAndSections(grouped.groups, grouped.groupOrder),
        transactions: sortedTransactions,
        loadingMoreTransactions: false,
        refreshing: false,
        noMoreTransactionsToLoad: action.addToEnd && action.transactions.length < PAGE_SIZE
      })
      break
    case 'account/LOADING_MORE_TRANSACTIONS':
      state = merge(state, {
        loadingMoreTransactions: true
      })
      break
    case 'account/UPDATE_REFRESHING':
      state = merge(state, {
        refreshing: true
      })
      break
    case 'account/CLEAR_TRANSACTIONS':
      localStorage.remove(storageKey)
      state = merge(initialState)
      break
  }
  return state
}

export default reducer
