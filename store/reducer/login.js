import merge from '../../util/merge'
import { authenticate } from '../../api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../apiError'

import { clearTransactions } from './developerOptions'
import { loadAccountDetails } from './account'
import LOGIN_STATUSES from '../../stringConstants/loginStatus'

const initialState = {
  loginStatus: LOGIN_STATUSES.LOGGED_OUT,
  loginFormOpen: false,
  username: 'testmember',
  password: 'testing123',
  failureMessage: ''
}

export const usernameUpdated = (username) => ({
  type: 'login/USERNAME_UPDATED',
  username
})

export const loginInProgress = () => ({
  type: 'login/LOGIN_IN_PROGRESS'
})

export const loggedIn = () => ({
  type: 'login/LOGGED_IN'
})

export const loginFailed = (message) => ({
  type: 'login/LOGIN_FAILED',
  message
})

export const passwordUpdated = (password) => ({
  type: 'login/PASSWORD_UPDATED',
  password
})

export const loggedOut = () => ({
  type: 'login/LOGGED_OUT'
})

export const closeLoginForm = () => ({
  type: 'login/CLOSE_LOGIN_FORM'
})

export const openLoginForm = () => ({
  type: 'login/OPEN_LOGIN_FORM'
})

export const login = (username, password) =>
  (dispatch) => {
      dispatch(loginInProgress())
      authenticate(username, password, dispatch)
        .then((sessionToken) => {
          if (sessionToken) {
            dispatch(loggedIn())
            //TODO: Should check if same user logging in and clear transactions on log in only if it is a different user
            dispatch(clearTransactions(true))
            dispatch(loadAccountDetails())
          }
        })
        .catch (err => {
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
    case 'login/LOGGED_IN':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGGED_IN,
        loginFormOpen: false
      })
      break
    case 'login/LOGIN_FAILED':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGIN_FAILED,
        failureMessage: action.message
      })
      break
    case 'login/LOGIN_IN_PROGRESS':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGIN_IN_PROGRESS
      })
      break
    case 'login/LOGGED_OUT':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGGED_OUT,
        username: 'testmember',
        password: 'testing123'
        // TODO: clear the session token?
      })
      break
    case 'login/OPEN_LOGIN_FORM':
      state = merge(state, {
        loginFormOpen: true
      })
      break
    case 'login/CLOSE_LOGIN_FORM':
      state = merge(state, {
        loginFormOpen: false
      })
      break
  }
  return state
}

export default reducer
