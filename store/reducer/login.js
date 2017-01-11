import merge from '../../util/merge'
import { authenticate } from '../../api/api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { loadAccountDetails, resetAccount } from './account'
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
  // logged in username state stores the username on successful login
  loggedInUsername: '',
  failedAttempts: []
}

export const loginInProgress = () => ({
  type: 'login/LOGIN_IN_PROGRESS'
})

export const loggedIn = (username) => ({
  type: LOGGED_IN,
  username
})

export const loggedOut = () => ({
  type: LOGGED_OUT
})

export const openLoginForm = (open = true) => ({
  type: 'login/OPEN_LOGIN_FORM',
  open
})

const attemptFailed = (username) => ({
  type: 'login/ATTEMPT_FAILED',
  username
})

export const login = (username, password) =>
  (dispatch) => {
    dispatch(loginInProgress())
    authenticate(username, password, dispatch)
      .then(() => {
        dispatch(loggedIn(username))
        dispatch(loadAccountDetails())
        dispatch(loadTransactions())
      })
      .catch (err => {
        if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
          err.response.json()
            .then(json => {
              if (json && json.passwordStatus === 'temporarilyBlocked') {
                dispatch(updateStatus('Account temporarily blocked', ERROR_SEVERITY.SEVERE))
              } else if (json && json.code === 'login') {
                dispatch(updateStatus('Your details are incorrect'))
                dispatch(attemptFailed(username))
                dispatch(openLoginForm(true))
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
    case LOGGED_IN:
      const failedAttempts = state.failedAttempts.filter(attempt => attempt.username !== action.username)
      state = merge(state, {
        loggedInUsername: action.username,
        loginStatus: LOGIN_STATUSES.LOGGED_IN,
        failedAttempts
      })
      break
    case 'login/LOGIN_IN_PROGRESS':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGIN_IN_PROGRESS,
        loginFormOpen: false
      })
      break
    case LOGGED_OUT:
      state = merge(state, { loginStatus: LOGIN_STATUSES.LOGGED_OUT })
      deleteSessionToken()
      break
    case 'login/OPEN_LOGIN_FORM':
      state = merge(state, {
        loginFormOpen: action.open
      })
      break
    case 'login/ATTEMPT_FAILED':
      const index = state.failedAttempts.findIndex(attempt => attempt.username === action.username)
      let newFailedAttempts
      if (index !== -1) {
        const noOfFails = state.failedAttempts[index].noOfFails
        newFailedAttempts = state.failedAttempts.slice()
        newFailedAttempts[index] = { username: action.username, noOfFails: noOfFails + 1 }
      } else {
        newFailedAttempts = [ ...state.failedAttempts, { username: action.username, noOfFails: 1 } ]
      }
      state = merge(state, {
        failedAttempts: newFailedAttempts
      })
      break
  }
  return state
}

export default reducer
