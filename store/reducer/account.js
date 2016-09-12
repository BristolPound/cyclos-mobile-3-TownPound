
import merge from '../../util/merge'
import { getAccount } from '../../api'


const initialState = {
  loadingBalance: true,
  balance: undefined
}

export const accountDetailsReceived = (account) => ({
  type: 'account/ACCOUNT_DETAILS_RECEIVED',
  account
})

export const loadAccountDetails = (sessionToken) =>
  (dispatch) =>
    getAccount(sessionToken, dispatch)
      .then(account => dispatch(accountDetailsReceived(account)))
      .catch(console.error)

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'account/ACCOUNT_DETAILS_RECEIVED':
      state = merge(state, {
        balance: action.account[0].status.balance,
        loadingBalance: false
      })
      break
  }
  return state
}

export default reducer
