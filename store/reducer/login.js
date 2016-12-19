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
  // logged in username state stores the username on successful login
  loggedInUsername: ''
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
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      state = merge(state, {
        loggedInUsername: action.username,
        loginStatus: LOGIN_STATUSES.LOGGED_IN,
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
