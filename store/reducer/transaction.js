import { ListView } from 'react-native'
import merge from '../../util/merge'
import groupTransactions from './groupTransactions'
import { getTransactions, getAccount } from '../../api'
import { successfulConnection } from './networkConnection'

const initialState = {
  loadingTransactions: true,
  loadingMoreTransactions: false,
  loadingBalance: true,
  transactions: [],
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

export const loadMoreTransactions = (page) =>
  (dispatch) => {
    dispatch(loadingMore())
    getTransactions(page)
      .then(transactions => dispatch(transactionsReceived(transactions, page)))
  }

export const loadTransactions = () =>
    (dispatch, getState) => {
        getAccount(getState().login.sessionToken)
          .then((json) => {
            return json[0].status.balance // get first item in list for now
          })
          .then(account => dispatch(accountDetailsReceived(account)))
          .catch(console.error)

        getTransactions(getState().login.sessionToken)
          .then(dispatch(successfulConnection()))
          .then(transactions => dispatch(transactionsReceived(transactions)))
          .catch(console.error)
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
      const mergedTransactions = [...state.transactions, ...action.transactions]
      const grouped = groupTransactions(mergedTransactions)
      state = merge(state, {
        loadingTransactions: false,
        dataSource: state.dataSource.cloneWithRowsAndSections(grouped.groups, grouped.groupOrder),
        page: action.page,
        transactions: mergedTransactions,
        loadingMoreTransactions: false,
      })
      break
    case 'account/LOADING_MORE_TRANSACTIONS':
      state = merge(state, {
        loadingMoreTransactions: true
      })
      break
  }
  return state
}

export default reducer
