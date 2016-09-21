import {encode} from 'base-64'
import merge from './util/merge'
import ApiError, { UNAUTHORIZED_ACCESS, throwOnError } from './apiError'

import {successfulConnection, connectionFailed} from './store/reducer/networkConnection'
import {loggedOut} from './store/reducer/login'

const BASE_URL = 'https://bristol-stage.community-currency.org/cyclos/api/'

export const setBaseUrl = newUrl => {
  BASE_URL = newUrl
}

export const PAGE_SIZE = 20

const httpHeaders = (sessionToken) => {
  const headers = new Headers()
  if (sessionToken) {
    headers.append('Session-Token', sessionToken)
  }
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  return headers
}

const basicAuthHeaders = (username, password) => {
  const headers = new Headers()
  headers.append('Authorization', 'Basic ' + encode(username + ':' + password))
  headers.append('Accept', 'application/json')
  return headers
}

const querystring = params =>
  Object.keys(params).map(key => key + '=' + params[key]).join('&')

const dispatchSuccessfulConnection = dispatch => response => {
  dispatch(successfulConnection())
  return response
}

const maybeDispatchFailure = dispatch => err => {
  if (err.message === 'Network request failed') {
    dispatch(connectionFailed())
  } else if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
    dispatch(loggedOut())
  } else {
    throw err
  }
}

const get = (url, params, sessionToken, dispatch) =>
  fetch(BASE_URL + url + (params ? '?' + querystring(params) : ''), {headers: httpHeaders(sessionToken)})
    .then(dispatchSuccessfulConnection(dispatch))
    .then(decodeResponse)
    .then((data) => {
      throwOnError(data.response, data.json)
      return data.json
    })
    .catch(maybeDispatchFailure(dispatch))

// Will continually load pages of a get request until successCriteria is met.
// successCriteria - should be a function with takes the result of the get request
//                   and returns a boolean as to whether the request is complete. It
//                   will be called on each individual get request.
const getPages = (url, params, sessionToken, dispatch, successCriteria, pageNo = 0) => {
  params = merge(params, { page: pageNo })
  return new Promise(function(resolve, reject) {
    get(url, params, sessionToken, dispatch)
      .then(results => {
        if (results.length < PAGE_SIZE || successCriteria === undefined || successCriteria(results)){
          resolve(results)
        } else {
          getPages(url, params, sessionToken, dispatch, successCriteria, pageNo + 1)
            .then(nextResults => resolve(results.concat(nextResults)))
            .catch(reject)
        }
      })
      .catch(reject)
  })
}

const post = (sessionToken, url, params, dispatch) =>
  fetch(BASE_URL + url, merge({headers: httpHeaders(sessionToken)}, {method: 'POST', body: JSON.stringify(params)}))
    .then(dispatchSuccessfulConnection(dispatch))
    .then(decodeResponse)
    .then((data) => {
      throwOnError(data.response, data.json, 201)
      return data.response
    })
    .catch(maybeDispatchFailure(dispatch))

export const getBusinesses = (dispatch) =>
  get('users', {
    fields: [
      'id',
      'address.addressLine1',
      'address.addressLine2',
      'address.zip',
      'address.location',
      'image.url',
      'display',
      'shortDisplay',
      'email'
    ],
    pageSize: 1000000,
    addressResult: 'primary',
    orderBy: 'alphabeticallyAsc'
  }, '', dispatch)

export const getBusinessProfile = (businessId, dispatch) =>
  get('users/' + businessId, {
    fields: [
      'customValues'
    ]
  }, '', dispatch)

export const getAccountBalance = (sessionToken, dispatch) =>
  get('self/accounts', {
    fields: ['status.balance']
  },
  sessionToken, dispatch)

export const getAccountDetails = (sessionToken, dispatch) =>
  get('users/self', {
    fields: ['display', 'shortDisplay', 'image.url', 'email', 'phones']
  },
  sessionToken, dispatch)

export const getTransactions = (sessionToken, dispatch, additionalParams, successCriteria) =>
  getPages('self/accounts/member/history', merge({
    fields: [
      'id',
      'transactionNumber',
      'date',
      'description',
      'amount',
      'type',
      'relatedAccount'
    ],
    pageSize: PAGE_SIZE
  }, additionalParams ? additionalParams : {}), sessionToken, dispatch, successCriteria)

export const putTransaction = (sessionToken, payment, dispatch) =>
  get('self/payments/data-for-perform', {
      to: payment.subject,
      fields: 'paymentTypes.id'
  }, sessionToken, dispatch)
  .then(json => post(sessionToken,
    'self/payments',
    {...payment,
      type: json.paymentTypes[0].id
    },
    dispatch
    ))

// decodes the response via the json() function, which returns a promise, combining
// the results with the original response object. This allows access to both
// response data (e.g. status code) and application level data.
const decodeResponse =
  response => response.json()
    .then(json => ({response, json}))

export const authenticate = (username, password, dispatch) =>
  fetch(BASE_URL + 'auth/session', {
    headers: basicAuthHeaders(username, password),
    method: 'POST'
  })
  .then(dispatchSuccessfulConnection(dispatch))
  .then(decodeResponse)
  .then((data) => {
    throwOnError(data.response, data.json)
    return data.json.sessionToken
  })
  .catch(maybeDispatchFailure(dispatch))
