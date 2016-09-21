
import merge from '../../util/merge'
import { getAccountBalance, getAccountDetails } from '../../api'

const initialState = {
  loadingBalance: true,
  loadingDetails: true,
  balance: undefined,
  details: undefined,
}

export const accountBalanceReceived = account => ({
  type: 'account/ACCOUNT_BALANCE',
  account
})

export const accountDetailsReceived = details => ({
  type: 'account/ACCOUNT_DETAILS_RECEIVED',
  details
})

export const clearAccountDetails = () => ({
  type: 'account/CLEAR_ACCOUNT_DETAILS'
})

export const loadAccountDetails = sessionToken =>
  (dispatch) => {
    getAccountBalance(sessionToken, dispatch)
      .then(account => dispatch(accountBalanceReceived(account)))
      .catch(console.error)
    getAccountDetails(sessionToken, dispatch)
      .then(details => dispatch(accountDetailsReceived(details)))
      .catch(console.error)
  }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'account/ACCOUNT_BALANCE':
      state = merge(state, {
        balance: action.account[0].status.balance,
        loadingBalance: false
      })
      break
    case 'account/ACCOUNT_DETAILS_RECEIVED':
      state = merge(state, {
        details: action.details,
        loadingDetails: false
      })
      break
    case 'account/CLEAR_ACCOUNT_DETAILS':
      state = merge(initialState)
      break
  }
  return state
}

export default reducer
