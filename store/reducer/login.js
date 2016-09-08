import merge from '../../util/merge'
import { authenticate } from '../../api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../apiError'
import NetworkError from '../../networkError'
import { loadTransactions } from './transaction'
import { connectionFailed } from './networkConnection'

const initialState = {
  loggedIn: false,
  loginFailed: '',
  loginInProgress: false,
  username: 'pshek',
  password: 'testing123',
  sessionToken: ''
}

export const usernameUpdated = (username) => ({
  type: 'login/USERNAME_UPDATED',
  username
})

export const loginInProgress = (loginInProgress) => ({
  type: 'login/LOGIN_IN_PROGRESS_CHANGED',
  loginInProgress
})

export const loggedIn = () => ({
  type: 'login/LOGGED_IN'
})

export const loginFailed = (loginFailed) => ({
  type: 'login/LOGIN_FAILED',
  loginFailed
})

export const passwordUpdated = (password) => ({
  type: 'login/PASSWORD_UPDATED',
  password
})

export const sessionTokenUpdated = (sessionToken) => ({
  type: 'login/SESSION_TOKEN_UPDATED',
  sessionToken
})

export const loggedOut = () => ({
  type: 'login/LOGGED_OUT'
})

export const login = (username, password) =>
  (dispatch) => {
      dispatch(loginInProgress(true))
      authenticate(username, password)
        .then((sessionToken) => {
          dispatch(loginInProgress(false))
          dispatch(loggedIn())
          dispatch(sessionTokenUpdated(sessionToken))
          dispatch(loadTransactions())
        })
        .catch (err => {
          dispatch(loginInProgress(false))
          if (err instanceof NetworkError) {
            dispatch(connectionFailed())
          } else if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
            switch (err.json.code) {
              case 'loggedOut':
                dispatch(loggedOut())
                break
              case 'invalidClient':
                dispatch(loginFailed('Username and/or password are incorrect. Please try again.'))
                break
              case 'login':
                err.json.passwordStatus
                  ? dispatch(loginFailed('Password Status: ' + err.json.passwordStatus))
                  : dispatch(loginFailed('User Status: ' + err.json.userStatus))
                break
              default:
                dispatch(loginFailed('Login failed: ' + err.json.passwordStatus))
            }
          } else {
            // TODO: What to do with unexpected errors?
            console.error(err)
          }
        })
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
    case 'login/SESSION_TOKEN_UPDATED':
      state = merge(state, {
        sessionToken: action.sessionToken
      })
      break
    case 'login/LOGGED_IN':
      state = merge(state, {
        loggedIn: true
      })
      break
    case 'login/LOGIN_FAILED':
      state = merge(state, {
        loginFailed: action.loginFailed
      })
      break
    case 'login/LOGIN_IN_PROGRESS_CHANGED':
      state = merge(state, {
        loginInProgress: action.loginInProgress
      })
      break
    case 'login/LOGGED_OUT':
      // TODO: the session token is invalid so we need to log the user out
      // clear transactions etc.
      break
  }
  return state
}

export default reducer
