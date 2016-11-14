import merge from '../../util/merge'
import { authenticate } from '../../api/api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { loadAccountDetails } from './account'
import { loadTransactions, resetTransactions } from './transaction'
import { deleteSessionToken } from '../../api/api'
import { updateStatus } from './statusMessage'
import color from '../../util/colors'

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
      .then((sessionToken) => {
        if (sessionToken) {
          dispatch(loggedIn())
          dispatch(loadAccountDetails())
          dispatch(loadTransactions())
        }
      })
      .catch (err => {
        if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
          switch (err.json.code) {
            case 'loggedOut':
              dispatch(loggedOut())
              break
            case 'invalidClient':
              dispatch(updateStatus('Username or password are incorrect', color.orange))
              break
            case 'login':
              const errMessage = err.json.passwordStatus==='temporarilyBlocked'
                ? 'Account temporarily blocked'
                : 'Your details are incorrect'
              dispatch(updateStatus(errMessage, color.orange))
              break
            default:
              dispatch(updateStatus('Server error', color.orange))
          }
        } else {
          dispatch(updateStatus('Unknown error - check your details', color.orange))
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
