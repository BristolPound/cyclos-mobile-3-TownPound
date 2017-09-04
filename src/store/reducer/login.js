import merge from '../../util/merge'
// import decrypt from '../../util/decrypt'
import { encrypt, decrypt } from '../../util/encryptionUtil'
import module_exists from '../../util/module_exists'
import { authenticate, deleteSessionToken, checkPin } from '../../api/api'
import ApiError, { UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { loadAccountDetails, resetAccount } from './account'
import { loadTransactions, resetTransactions } from './transaction'
import { updateStatus, ERROR_SEVERITY, unknownError } from './statusMessage'
import { loadPaymentData } from './business'
import md5 from 'md5'
// import CryptoJS from 'crypto-js'
// import CryptoJS from 'cryptojs'
// import Crypter from 'cryptr'
import uuidv4 from 'uuid/v4'

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
  askToUnlock: false,
  acceptedUsernames: {},
  storePassword: false,
  // logged in username state stores the username on successful login
  loggedInUsername: '',
  loggedInName: '',
  encryptedPassword: '',
  AUID: '',
  // never stored
  encryptionKey: '',
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

export const generateAUID = () => ({
  type: 'login/GENERATE_AUID'
})

export const openLoginForm = (open = true) => ({
  type: 'login/OPEN_LOGIN_FORM',
  open
})

export const reauthorise = (code) =>
  (dispatch, getState) => {
    var username, encryptedPassword, encryptionKey, password

    username = getState().login.loggedInUsername
    encryptedPassword = getState().login.encryptedPassword
    encryptionKey = getState().login.encryptionKey
    code && dispatch(setEncryptionKey(code))
    encryptionKey = getState().login.encryptionKey
    console.log("decrypting with " + encryptionKey)
    password = decrypt(encryptedPassword, encryptionKey)
    console.log("decrypted password is " + password + " after being " + encryptedPassword)

    return authenticate(username, password, dispatch)
      .then(() => {
        console.log("authenticated")
        return true
      })
      .catch (err => {
        if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
          err.response.json()
            .then(json => {
              if (json && ['login', 'missingAuthorization'].includes(json.code)) {
                dispatch(updateStatus('Incorrect Unlock', ERROR_SEVERITY.SEVERE))
              }
              else if (json && ['temporarilyBlocked', 'remoteAddressBlocked'].includes(json.code)){
                dispatch(updateStatus('Temporarily blocked', ERROR_SEVERITY.SEVERE))
              }
              else {
                dispatch(unknownError(err))
              }
            })
            .catch(() => {
              dispatch(unknownError(err))
            })
        }
        return false
      })
  }


export const setStorePassword = (storePassword = true) => ({
  type: 'login/SET_STORE_PASSWORD',
  storePassword
})

export const flipStorePassword = () => ({
  type: 'login/FLIP_STORE_PASSWORD'
})

export const clearEncryptionKey = () => ({
  type: 'login/CLEAR_ENCRYPTION_KEY'
})

const setEncryptionKey = (unlockCode) => ({
  type: 'login/SET_ENCRYPTION_KEY',
  unlockCode
})

const storeEncryptedPassword = (password) => ({
  type: 'login/STORE_ENCRYPTED_PASSWORD',
  password
})

const openPrivacyPolicy = () => ({
  type: 'login/OPEN_PRIVACY_POLICY'
})

export const openPasswordDisclaimer = (open = true) => ({
  type: 'login/OPEN_PASSWORD_DISCLAIMER',
  open
})

export const authoriseCyclosPin = (PIN) =>

  (dispatch, getState) => {
    return checkPin(PIN)
      .then((success) => {
        if (success) {
          console.log("CORRECT CYCLOS PIN ENTERED")
          dispatch(setEncryptionKey(PIN))
          return true
        }
        else {
          console.log("Incorrect CYCLOS PIN")
          return false
        }
      })
      .catch((err) => {
        return false
      })
  }


export const acceptPasswordDisclaimer = (accepted, enteredPIN, username, password) =>
  (dispatch, getState) => {
    // dispatch(setStorePassword())
    if (accepted) {
      // dispatch(storeEncryptedPassword(password))
      checkPin(enteredPIN)
        .then((success) => {
          if (success) {
            console.log("CORRECT CYCLOS PIN ENTERED")
            dispatch(setEncryptionKey(enteredPIN))
            dispatch(login(username, password))
          }
          else {
            // TODO: implement a failure method if wrong cyclos pin entered
            console.log("Incorrect CYCLOS PIN")
            dispatch(setStorePassword(false))
          }
        })
        .catch((err) => {
          // TODO: implement a failure method if wrong cyclos pin entered
          dispatch(setStorePassword(false))
        })
    }
    else {
      dispatch(setStorePassword(false))
      dispatch(login(username, password))
    }

    dispatch(openPasswordDisclaimer(false))
  }


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
      dispatch(simplifyLogin(username, password))
    }
    else {
      dispatch(privacyPolicyAccepted(false))
    }
  }

export const unlockAndLogin = () =>
  (dispatch, getState) => {
    var username, encryptedPassword, encryptionKey, password

    username = getState().login.loggedInUsername
    encryptedPassword = getState().login.encryptedPassword
    encryptionKey = getState().login.encryptionKey
    password = decrypt(encryptedPassword, encryptionKey)

    dispatch(login(username, password))
  }


export const beginLogin = (username, password) =>
  (dispatch, getState) => {
    let acceptedUsernames = getState().login.acceptedUsernames
    const hashedUsername = md5(username)
    if (acceptedUsernames && acceptedUsernames[hashedUsername]) {
      dispatch(simplifyLogin(username, password))
    }
    else {
      dispatch(openPrivacyPolicy())
    }
  }

const simplifyLogin = (username, password) =>
  (dispatch, getState) => {
    // If store password was checked, open the disclaimer before loggin in
    if (getState().login.storePassword && getState().login.encryptedPassword === '') {
      dispatch(openPasswordDisclaimer(true))
    }
    // Otherwise just log in
    else {
      dispatch(login(username, password))
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
        // Store the password if they've accepted the agreement and it's not stored already
        if (getState().login.storePassword && getState().login.encryptedPassword === '') {
          dispatch(storeEncryptedPassword(password))
        }
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
            .catch(() => {
              dispatch(unknownError(err))
            })
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
    case 'login/SET_STORE_PASSWORD':
      var newStorePassword = action.storePassword

      var newEncryptedPassword = newStorePassword
        ? state.encryptedPassword
        : ''
      state = merge(state, {
        storePassword: newStorePassword,
        encryptedPassword: newEncryptedPassword
      })
      break
    case 'login/FLIP_STORE_PASSWORD':
      var newStorePassword = !state.storePassword
      var newEncryptedPassword = newStorePassword
        ? state.encryptedPassword
        : ''
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
        encryptedPassword: '',
        encryptionKey: '',
      })
      deleteSessionToken()
      break
    case 'login/OPEN_LOGIN_FORM':
      state = merge(state, {
        loginFormOpen: action.open
      })
      break
    case 'login/OPEN_PASSWORD_DISCLAIMER':
      state = merge(state, {
        passwordDisclaimerOpen: action.open
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
      var newEncryptedPassword = encrypt(action.password, state.encryptionKey)
      console.log("encrypted password stored is " + newEncryptedPassword)
      state = merge(state, {
        encryptedPassword: newEncryptedPassword
      })
      break
    case 'login/CLEAR_ENCRYPTION_KEY':
      state = merge(state, {
        encryptionKey: ''
      })
      break
    case 'login/SET_ENCRYPTION_KEY':
      var unlockCode = action.unlockCode
      // var secretEncryptionPart = module_exists('@Config/secrets')
      //   ? require('@Config/secrets').default.encryptionComponent
      //   : 'test key'
      var secretEncryptionPart = "1234"
      var encryptionKey = unlockCode + state.AUID + secretEncryptionPart

      console.log("encryption key is " + encryptionKey)
      state = merge(state, {
        encryptionKey: encryptionKey,
        unlockCode: md5(action.unlockCode)
      })
      break
    case 'login/GENERATE_AUID':
      var newAUID = uuidv4()
      state = merge(state, {
        AUID: newAUID
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
