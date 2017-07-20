import merge from '../../util/merge'
import { authenticate } from '../../api/api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { loadAccountDetails, resetAccount } from './account'
import { loadTransactions, resetTransactions } from './transaction'
import { deleteSessionToken } from '../../api/api'
import { updateStatus, ERROR_SEVERITY, unknownError } from './statusMessage'
import { loadPaymentData } from './business'
import md5 from 'md5'

export const LOGIN_STATUSES = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
  LOGIN_IN_PROGRESS: 'LOGIN_IN_PROGRESS'
}

export const unlockCharNo = 3

const initialState = {
  loginStatus: LOGIN_STATUSES.LOGGED_OUT,
  loginFormOpen: false,
  // logged in username state stores the username on successful login
  loggedInUsername: '',
  loggedInName: '',
  passToUnlock: ''
}

export const loginInProgress = () => ({
  type: 'login/LOGIN_IN_PROGRESS'
})

const loggedIn = (username, passToUnlock) => ({
  type: 'login/LOGGED_IN',
  username,
  passToUnlock
})

export const loggedOut = () => ({
  type: 'login/LOGGED_OUT'
})

export const openLoginForm = (open = true) => ({
  type: 'login/OPEN_LOGIN_FORM',
  open
})

export const login = (username, password) =>
  (dispatch, getState) => {
    dispatch(loginInProgress())
    authenticate(username, password, dispatch)
      .then(() => {
        dispatch(loadTransactions(username === getState().login.loggedInUsername))
        dispatch(loadAccountDetails())
        dispatch(loggedIn(username, md5(password.substr(password.length - unlockCharNo))))
        dispatch(loadPaymentData())
      })
      .catch (err => {
        if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
          err.response.json()
            .then(json => {
              if (json && json.passwordStatus === 'temporarilyBlocked') {
                dispatch(updateStatus('Account temporarily blocked', ERROR_SEVERITY.SEVERE))
              } else if (json && json.code === 'login') {
                dispatch(updateStatus('Your details are incorrect'))
              } else {
                dispatch(unknownError(err))
              }
            })
            .catch(() => dispatch(unknownError(err)))
        }
      })
  }

export const logout = () => dispatch => {
  dispatch(loggedOut())
  dispatch(resetTransactions())
  dispatch(resetAccount())
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'login/LOGGED_IN':
      state = merge(state, {
        loggedInUsername: action.username,
        loginStatus: LOGIN_STATUSES.LOGGED_IN,
        passToUnlock: action.passToUnlock
      })
      break
    case 'login/LOGIN_IN_PROGRESS':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGIN_IN_PROGRESS,
        loginFormOpen: false
      })
      break
    case 'login/LOGGED_OUT':
      state = merge(state, { loginStatus: LOGIN_STATUSES.LOGGED_OUT, passToUnlock: '' })
      deleteSessionToken()
      break
    case 'login/OPEN_LOGIN_FORM':
      state = merge(state, {
        loginFormOpen: action.open
      })
      break
    case 'account/ACCOUNT_DETAILS_RECEIVED':
      state = merge(state, {
        loggedInName: action.details.display.split(' ')[0],
      })
      break
  }
  return state
}

export default reducer
