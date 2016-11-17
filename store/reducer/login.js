import merge from '../../util/merge'
import { authenticate } from '../../api/api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { loadAccountDetails } from './account'
import { loadTransactions, resetTransactions } from './transaction'
import { deleteSessionToken } from '../../api/api'
import { updateStatus, ERROR_SEVERITY, unknownError } from './statusMessage'

export const LOGGED_OUT = 'login/LOGGED_OUT'
export const LOGGED_IN = 'login/LOGGED_IN'

export const LOGIN_STATUSES = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
  LOGIN_IN_PROGRESS: 'LOGIN_IN_PROGRESS'
}

const initialState = {
  loginStatus: LOGIN_STATUSES.LOGGED_OUT,
  loginFormOpen: false,
  // username / password state backs the login form
  username: '',
  password: '',
  // logged in username state stores the username on succesfull login
  loggedInUsername: ''
}

export const loginInProgress = () => ({
  type: 'login/LOGIN_IN_PROGRESS'
})

export const loggedIn = () => ({
  type: LOGGED_IN
})

export const usernameUpdated = (username) => ({
  type: 'login/USERNAME_UPDATED',
  username
})

export const passwordUpdated = (password) => ({
  type: 'login/PASSWORD_UPDATED',
  password
})

export const loggedOut = () => ({
  type: LOGGED_OUT
})

export const openLoginForm = (open = true) => ({
  type: 'login/OPEN_LOGIN_FORM',
  open
})

export const login = (username, password) =>
  (dispatch) => {
    dispatch(loginInProgress())
    authenticate(username, password, dispatch)
      .then(() => {
        dispatch(loggedIn())
        dispatch(loadAccountDetails())
        dispatch(loadTransactions())
      })
      .catch (err => {
        if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
          if (err.json.passwordStatus === 'temporarilyBlocked') {
            dispatch(updateStatus('Account temporarily blocked', ERROR_SEVERITY.SEVERE))
          } else if (err.json.code === 'login') {
            dispatch(updateStatus('Your details are incorrect'))
          } else {
          dispatch(unknownError(err))
          }
        }
      })
  }

export const logout = () => dispatch => {
  dispatch(loggedOut())
  dispatch(resetTransactions())
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'login/USERNAME_UPDATED':
      state = merge(state, {
        username: action.username
      })
      break
    case 'login/PASSWORD_UPDATED':
      state = merge(state, {
        password: action.password
      })
      break
    case LOGGED_IN:
      state = merge(state, {
        loggedInUsername: state.username,
        loginStatus: LOGIN_STATUSES.LOGGED_IN,
      })
      break
    case 'login/LOGIN_FAILED':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGIN_FAILED,
      })
      break
    case 'login/LOGIN_IN_PROGRESS':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGIN_IN_PROGRESS,
        loginFormOpen: false
      })
      break
    case LOGGED_OUT:
      state = initialState
      deleteSessionToken()
      break
    case 'login/OPEN_LOGIN_FORM':
      state = merge(state, {
        loginFormOpen: action.open
      })
      break
  }
  return state
}

export default reducer
