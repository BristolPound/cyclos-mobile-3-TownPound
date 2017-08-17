import merge from '../../util/merge'
import { authenticate } from '../../api/api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { loadAccountDetails, resetAccount } from './account'
import { loadTransactions, resetTransactions } from './transaction'
import { deleteSessionToken } from '../../api/api'
import { updateStatus, ERROR_SEVERITY, unknownError } from './statusMessage'
import { loadPaymentData } from './business'
import md5 from 'md5'
import CryptoJS from 'crypto-js'

export const LOGIN_STATUSES = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
  LOGIN_IN_PROGRESS: 'LOGIN_IN_PROGRESS'
}

export const unlockCharNo = 3

const initialState = {
  loginStatus: LOGIN_STATUSES.LOGGED_OUT,
  loginFormOpen: false,
  privacyPolicyOpen: false,
  privacyPolicyAccepted: false,
  acceptedUsernames: {},
  storePassword: false,
  // logged in username state stores the username on successful login
  loggedInUsername: '',
  encryptedPassword: {},
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

export const setStorePassword = () => ({
  type: 'login/STORE_PASSWORD'
})

export const storeEncryptedPassword = (password) => ({
  type: 'login/STORE_ENCRYPTED_PASSWORD',
  password
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
      .then(() => {
        dispatch(loadTransactions(username === getState().login.loggedInUsername))
        dispatch(loadAccountDetails())
        dispatch(loggedIn(username, md5(password.substr(password.length - unlockCharNo))))
        dispatch(loadPaymentData())
        getState().login.privacyPolicyAccepted && dispatch(storeAcceptedUsername(username))
        getState().login.storePassword && dispatch(storeEncryptedPassword(password))
      })
      .catch (err => {
        if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
          err.response.json()
            .then(json => {
              if (json && json.passwordStatus === 'temporarilyBlocked') {
                dispatch(updateStatus('Account temporarily blocked', ERROR_SEVERITY.SEVERE))
              } else if (json && json.code === 'login') {
                dispatch(updateStatus('Your details are incorrect'))
              } else if (json && json.code === 'remoteAddressBlocked') {
                dispatch(updateStatus('Remote address temporarily blocked', ERROR_SEVERITY.SEVERE))
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
  dispatch(privacyPolicyAccepted(false))
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
    case 'login/STORE_PASSWORD':
      var newStorePassword = !state.storePassword
      var newEncryptedPassword = !newStorePassword
        ? ''
        : state.encryptedPassword
      state = merge(state, {
        storePassword: newStorePassword,
        encryptedPassword: newEncryptedPassword
      })
      break
    case 'login/LOGGED_OUT':
      state = merge(state, {
        loginStatus: LOGIN_STATUSES.LOGGED_OUT,
        passToUnlock: '',
        storePassword: false,
        encryptedPassword: ''
      })
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
    case 'login/STORE_ENCRYPTED_PASSWORD':
      var encryptedPassword = CryptoJS.AES.encrypt(action.password, 'test key')
      state = merge(state, {
        encryptedPassword: encryptedPassword
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
  return state
}

export default reducer
