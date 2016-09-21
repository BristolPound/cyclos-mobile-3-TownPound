import merge from '../../util/merge'
import { authenticate } from '../../api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../apiError'

import { clearTransactions, loadInitialTransactions } from './transaction'
import { clearAccountDetails, loadAccountDetails } from './account'

const initialState = {
  loggedIn: false,
  loginFailed: '',
  loginInProgress: false,
  username: 'testmember',
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
      authenticate(username, password, dispatch)
        .then((sessionToken) => {
          dispatch(loginInProgress(false))
          if (sessionToken) {
            dispatch(loggedIn())
            //TODO: Should check if same user logging in and clear transactions on log in only if it is a different user
            dispatch(clearTransactions())
            dispatch(loadInitialTransactions())
            dispatch(sessionTokenUpdated(sessionToken))
            dispatch(loadAccountDetails(sessionToken))
          }
        })
        .catch (err => {
          dispatch(loginInProgress(false))
          if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
            switch (err.json.code) {
              case 'loggedOut':
                dispatch(loggedOut())
                break
              case 'invalidClient':
                dispatch(loginFailed('Username and/or password are incorrect. Please try again.'))
                break
              case 'login':
                const errMessage = err.json.passwordStatus==='temporarilyBlocked'
                  ? 'Your account has been temporarily blocked'
                  : 'Username and/or password are incorrect. Please try again.'
                dispatch(loginFailed(errMessage))
                break
              default:
                dispatch(loginFailed('Login failed: ' + JSON.stringify(err.json)))
            }
          } else {
            // TODO: What to do with unexpected errors?
            console.error(err)
          }
        })
    }

export const logout = () => dispatch => {
    dispatch(loggedOut())
    dispatch(clearTransactions())
    dispatch(clearAccountDetails())
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
      state = merge(state, {
        loggedIn: false,
        username: 'testmember',
        password: 'testing123',
        sessionToken: ''
      })
      break
  }
  return state
}

export default reducer
