import merge from '../../util/merge'
import { authenticate } from '../../api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../apiError'
import NetworkError from '../../networkError'
import { loadTransactions } from './transaction'
import { networkConnectionChanged } from './status'

const initialState = {
  loggedIn: false,
  loginFailed: false,
  loginInProgress: false,
  username: 'test1',
  password: 'testing123'
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

export const loginFailed = () => ({
  type: 'login/LOGIN_FAILED'
})

export const passwordUpdated = (password) => ({
  type: 'login/PASSWORD_UPDATED',
  password
})

export const login = (username, password) =>
  (dispatch) => {
      dispatch(loginInProgress(true))
      authenticate(username, password)
        .then(() => {
          dispatch(loginInProgress(false))
          dispatch(loggedIn())
          dispatch(loadTransactions())
        })
        .catch((err) => {
          dispatch(loginInProgress(false))
          if (err instanceof NetworkError) {
            dispatch(networkConnectionChanged(false))
          } else if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
            dispatch(loginFailed())
          } else {
            // TODO: What to do with unexpected errors?
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
    case 'login/LOGGED_IN':
      state = merge(state, {
        loggedIn: true
      })
      break
    case 'login/LOGIN_FAILED':
      state = merge(state, {
        loginFailed: true
      })
      break
    case 'login/LOGIN_IN_PROGRESS_CHANGED':
      state = merge(state, {
        loginInProgress: action.loginInProgress
      })
      break
  }
  return state
}

export default reducer
