import {encode} from 'base-64'
import merge from './util/merge'
import {throwOnError} from './apiError'

import {successfulConnection, connectionFailed} from './store/reducer/networkConnection'

const BASE_URL = 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'

const httpHeaders = (sessionToken = '') => {
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

const dispatchConnectionFailed = dispatch => err => {
  if (err.message === 'Network request failed') {
    dispatch(connectionFailed())
  } else {
    throw err
  }
}

const get = (url, params, sessionToken, dispatch) =>
  fetch(BASE_URL + url + (params ? '?' + querystring(params) : ''), {headers: httpHeaders(sessionToken)})
    .then(dispatchSuccessfulConnection(dispatch))
    .catch(dispatchConnectionFailed(dispatch))
    .then(decodeResponse)
    .then((data) => {
      throwOnError(data.response, data.json)
      return data.json
    })

const post = (sessionToken, url, params, dispatch) =>
  fetch(BASE_URL + url, merge({headers: httpHeaders(sessionToken)}, {method: 'POST', body: JSON.stringify(params)}))
    .then(dispatchSuccessfulConnection(dispatch))
    .catch(dispatchConnectionFailed(dispatch))
    .then(decodeResponse)
    .then((data) => {
      throwOnError(data.response, data.json, 201)
      return data.response
    })

export const getBusinesses = () =>
  get('users', {
    fields: [
      'email',
      'id',
      'name',
      'username',
      'address.addressLine1',
      'address.addressLine2',
      'address.zip',
      'address.location',
      'image.url',
      'phone',
      'display',
      'shortDisplay'
    ]
  }, dispatch)

export const getAccount = (sessionToken, dispatch) =>
  get('self/accounts', {
    fields: ['status.balance']
  },
  sessionToken, dispatch)


export const getTransactions = (sessionToken, dispatch, page = 0) =>
  get('self/accounts/member/history', {
    fields: [
      'id',
      'transactionNumber',
      'date',
      'description',
      'amount',
      'type',
      'relatedAccount'
    ],
    page,
    pageSize: 20
  }, sessionToken, dispatch)

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
  .catch(dispatchConnectionFailed(dispatch))
  .then(decodeResponse)
  .then((data) => {
    throwOnError(data.response, data.json)
    return data.json.sessionToken
  })
