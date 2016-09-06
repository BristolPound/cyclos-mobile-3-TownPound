import { ListView } from 'react-native'
import merge from '../../util/merge'
import groupTransactions, { sortTransactions } from './groupTransactions'
import { getTransactions, getAccount, PAGE_SIZE } from '../../api'
import * as localStorage from '../../localStorage'

const isValidList = (transactionList) => transactionList !== undefined && transactionList !== null && transactionList.length > 0
const storageKey = localStorage.storageKeys.TRANSACTION_KEY

const initialState = {
  loadingTransactions: true,
  loadingMoreTransactions: false,
  loadingBalance: true,
  transactions: [],
  refreshing: false,
  oldestTransaction: null,
  noMoreTransactionsToLoad: false,
  dataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber === b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a == b
  })
}

export const accountDetailsReceived = (account) => ({
  type: 'account/ACCOUNT_DETAILS_RECEIVED',
  account
})

export const transactionsReceived = (transactions, page = 1) => ({
  type: 'account/TRANSACTIONS_RECEIVED',
  transactions,
  page
})

export const loadingMore = () => ({
  type: 'account/LOADING_MORE_TRANSACTIONS'
})

const updateRefreshing = () => ({
  type: 'account/UPDATE_REFRESHING'
})

export const loadMoreTransactions = () =>
  (dispatch, getState) => {
    dispatch(loadingMore())
    getTransactions(getState().transaction.oldestTransaction)
      .then(transactions => dispatch(transactionsReceived(transactions)))
  }

export const loadTransactions = () =>
    (dispatch) => {
        getAccount()
          .then(account => dispatch(accountDetailsReceived(account)))
          .catch(console.error)

        localStorage.get(storageKey)
          .then(storedTransactions => {
              dispatch(isValidList(storedTransactions)
                ? transactionsReceived(storedTransactions)
                : loadTransactionsFromApi())
          })
    }

const loadTransactionsFromApi = () =>
    (dispatch) =>
      getTransactions()
        .then(transactions => dispatch(transactionsReceived(transactions)))
        .catch(console.error)

export const refreshTransactions = () =>
    (dispatch) => {
      localStorage.remove(storageKey)
      dispatch(updateRefreshing())
      dispatch(loadTransactionsFromApi())
    }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'account/ACCOUNT_DETAILS_RECEIVED':
      state = merge(state, {
        balance: action.account,
        loadingBalance: false
      })
      break
    case 'account/TRANSACTIONS_RECEIVED':
      const mergedTransactions = state.refreshing ? action.transactions : [...state.transactions, ...action.transactions]
      const sortedTransactions = sortTransactions(mergedTransactions)
      localStorage.save(storageKey, sortedTransactions)
      const grouped = groupTransactions(sortedTransactions)
      state = merge(state, {
        loadingTransactions: false,
        dataSource: state.dataSource.cloneWithRowsAndSections(grouped.groups, grouped.groupOrder),
        page: action.page,
        oldestTransaction: sortedTransactions[sortedTransactions.length - 1],
        transactions: mergedTransactions,
        loadingMoreTransactions: false,
        refreshing: false,
        noMoreTransactionsToLoad: action.transactions.length < PAGE_SIZE
      })
      break
    case 'account/LOADING_MORE_TRANSACTIONS':
      state = merge(state, {
        loadingMoreTransactions: true
      })
      break
    case 'account/UPDATE_REFRESHING':
      state = merge(state, {
        refreshing: true,
        oldestTransaction: null
      })
      break
  }
  return state
}

export default reducer
