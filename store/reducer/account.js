
import merge from '../../util/merge'
import { getAccountBalance } from '../../api/accounts'
import { getAccountDetails } from '../../api/users'

const initialState = {
  loadingBalance: true,
  loadingDetails: true,
  balance: undefined,
  details: {},
}

export const accountBalanceReceived = account => ({
  type: 'account/ACCOUNT_BALANCE',
  account
})

const accountDetailsReceived = details => ({
  type: 'account/ACCOUNT_DETAILS_RECEIVED',
  details
})

export const loadAccountDetails = () =>
  (dispatch) => {
    getAccountBalance(dispatch)
      .then(account => dispatch(accountBalanceReceived(account)))
      .catch(console.error)
    getAccountDetails(dispatch)
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
  }
  return state
}

export default reducer
