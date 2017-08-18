import merge from '../../util/merge'
import { authenticate } from '../../api/api'
import { isApiError, UNAUTHORIZED_ACCESS } from '../../api/apiError'
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

const AUTH_FAILURES = {
  WRONG_CREDENTIALS: 'WRONG_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  ACCOUNT_TEMPORATILY_BLOCKED: 'ACCOUNT_TEMPORATILY_BLOCKED',
  ADDRESS_TEMPORATILY_BLOCKED: 'ADDRESS_TEMPORATILY_BLOCKED',
}
export const unlockCharNo = 3

const initialState = {
  loginStatus: LOGIN_STATUSES.LOGGED_OUT,
  loginFormOpen: false,
  privacyPolicyOpen: false,
  privacyPolicyAccepted: false,
  acceptedUsernames: {},
  // logged in username state stores the username on successful login
  loggedInUsername: '',
  loggedInName: '',
  passToUnlock: ''
}

let currentLoginStatus = initialState.loginStatus

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

export const openPrivacyPolicy = () => ({
  type: 'login/OPEN_PRIVACY_POLICY'
})

const privacyPolicyAccepted = (accepted) => ({
  type: 'login/PRIVACY_POLICY_ACCEPTED',
  accepted
})

const storeAcceptedUsername = (username) => ({
  type: 'login/STORE_ACCEPTED_USERNAME',
  username
})

export const acceptPrivacyPolicy = (accepted, username, password) =>
  (dispatch, getState) => {
    if (accepted) {
      dispatch(privacyPolicyAccepted(true))
      dispatch(login(username, password))
    }
    else {
      dispatch(privacyPolicyAccepted(false))
    }
  }


export const beginLogin = (username, password) =>
  (dispatch, getState) => {
    let acceptedUsernames = getState().login.acceptedUsernames
    const hashedUsername = md5(username)
    if (acceptedUsernames && acceptedUsernames[hashedUsername]) {
      dispatch(login(username, password))
    }
    else {
      dispatch(openPrivacyPolicy())
    }
  }


export const login = (username, password) =>
  (dispatch, getState) => {
    dispatch(loginInProgress())
    authenticate(username, password, dispatch)
    .then((sessionToken) => {
      dispatch(loadTransactions(username === getState().login.loggedInUsername))
      dispatch(loadAccountDetails())
      dispatch(loggedIn(username, md5(password.substr(password.length - unlockCharNo))))
      dispatch(loadPaymentData())
      getState().login.privacyPolicyAccepted && dispatch(storeAcceptedUsername(username))
    })
    .catch(err => {
      console.log("error on auth")
      if (!isApiError(err, UNAUTHORIZED_ACCESS)) {
        console.log("no APIError")
        dispatch(unknownError(err))
      }
      else {
        console.log("APIError")
      }
      //dispatch(loggedOut())
    })
  }

export const logout = () => dispatch => {
  dispatch(loggedOut())
  dispatch(resetTransactions())
  dispatch(resetAccount())
  dispatch(privacyPolicyAccepted(false))
}

export const getLoginStatus = () => {
  return currentLoginStatus
}

export const isLoggedIn = () => {
  return (getLoginStatus() == LOGIN_STATUSES.LOGGED_IN)
}

export const openLoginFormIfUnauthorised = (dispatch, err) => {
  if (isApiError(err, UNAUTHORIZED_ACCESS)) {
    dispatch(openLoginForm(true))
  } else {
    dispatch(unknownError(err))
  }
}

export const logoutIfUnauthorised = (dispatch, err, errorOptions) => {

  return err.response.json()

  .then(json => {
    switch (true) {
      case !json:
        return

      case (json.passwordStatus === 'temporarilyBlocked'):
        return AUTH_FAILURES.ACCOUNT_TEMPORATILY_BLOCKED

      case (json.code === 'login' || json.code === 'loggedOut'):
          return ( isLoggedIn() ? AUTH_FAILURES.SESSION_EXPIRED : AUTH_FAILURES.WRONG_CREDENTIALS)

      case (json.code === 'remoteAddressBlocked'):
        return AUTH_FAILURES.ADDRESS_TEMPORATILY_BLOCKED
    }
  },() => {})

  .then(authError => {

    if (errorOptions
      && errorOptions.logoutOnUnauthorised
      && (authError == AUTH_FAILURES.SESSION_EXPIRED || authError == AUTH_FAILURES.ACCOUNT_TEMPORATILY_BLOCKED)
      && isLoggedIn()
    )
    {
      setTimeout(() => {
        dispatch(logout())
      }, 500)
      if (!errorOptions.failGracefullyOnLogout) err.type = FAIL_GRACEFULLY
    }

    console.log(authError)

    switch (authError) {
      case AUTH_FAILURES.WRONG_CREDENTIALS:
        dispatch(updateStatus('Your details are incorrect'))
        break;
      case AUTH_FAILURES.SESSION_EXPIRED:
        dispatch(updateStatus('Your session has expired'))
        break;
      case AUTH_FAILURES.ACCOUNT_TEMPORATILY_BLOCKED:
        dispatch(updateStatus('Account temporarily blocked', ERROR_SEVERITY.SEVERE))
        break;
      case AUTH_FAILURES.ADDRESS_TEMPORATILY_BLOCKED:
        dispatch(updateStatus('Network address temporarily blocked', ERROR_SEVERITY.SEVERE))
        break;
      default:
        dispatch(unknownError(err))
    }

    err.authError = authError

    return err
  })
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
    case 'login/OPEN_PRIVACY_POLICY':
      state = merge(state, {
        privacyPolicyOpen: true
      })
      break
    case 'login/PRIVACY_POLICY_ACCEPTED':
      state = merge(state, {
        privacyPolicyOpen: false,
        privacyPolicyAccepted: action.accepted
      })
      break
    case 'login/STORE_ACCEPTED_USERNAME':
      const username = action.username
      const hashedUsername = md5(username)
      const newAcceptedUsernames = merge(state.acceptedUsernames)
      newAcceptedUsernames[hashedUsername] = true
      state = merge(state, {
        privacyPolicyAccepted: false,
        acceptedUsernames: newAcceptedUsernames
      })
      break
    case 'account/ACCOUNT_DETAILS_RECEIVED':
      state = merge(state, {
        loggedInName: action.details.display.split(' ')[0],
      })
      break
  }
  currentLoginStatus = state.loginStatus
  return state
}

export default reducer
