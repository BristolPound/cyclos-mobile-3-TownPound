
import merge from '../../util/merge'
import { getAccountBalance } from '../../api/accounts'
import { getAccountDetails } from '../../api/users'
import { UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { openLoginForm } from './login'
import { updateStatus } from './statusMessage'
import color from '../../util/colors'

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

const handleAPIError = (dispatch) => (err) => {
  if (err.type === UNAUTHORIZED_ACCESS) {
    dispatch(openLoginForm(true))
  } else {
    dispatch(updateStatus('Unknown error', color.orange))
  }
}

export const loadAccountDetails = () =>
  (dispatch) => {
    getAccountBalance(dispatch)
      .then(account => dispatch(accountBalanceReceived(account)))
      .catch(handleAPIError(dispatch))
    getAccountDetails(dispatch)
      .then(details => dispatch(accountDetailsReceived(details)))
      .catch(handleAPIError(dispatch))
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
