import {encode} from 'base-64'
import merge from './util/merge'
import {throwOnError} from './apiError'
import NetworkError from './networkError'

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

const get = (url, params, sessionToken) =>
  fetch(BASE_URL + url + (params ? '?' + querystring(params) : ''), {headers: httpHeaders(sessionToken)})
    .catch((err) => {
      if (err.message === 'Network request failed') {
        throw new NetworkError(err)
      }
      throw err
    })
    .then(decodeResponse)
    .then((data) => {
      throwOnError(data.response, data.json)
      return data.json
    })

const post = (sessionToken, url, params) =>
  fetch(BASE_URL + url, merge({headers: httpHeaders(sessionToken)}, {method: 'POST', body: JSON.stringify(params)}))
    .catch((err) => {
      if (err.message === 'Network request failed') {
        throw new NetworkError(err)
      }
      console.error(err)
    })
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
  })

export const getAccount = (sessionToken) =>
  get('self/accounts', {
    fields: ['status.balance']
  }, sessionToken)


export const getTransactions = (sessionToken, page = 0) =>
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
  }, sessionToken)

export const putTransaction = (sessionToken, payment) =>
  get('self/payments/data-for-perform', {
      to: payment.subject,
      fields: 'paymentTypes.id'
  }, sessionToken)
  .then(json => {
    return post(sessionToken,
      'self/payments',
      {...payment, type: json.paymentTypes[0].id})
    })

// decodes the response via the json() function, which returns a promise, combining
// the results with the original response object. This allows access to both
// response data (e.g. status code) and application level data.
const decodeResponse =
  response => response.json()
    .then(json => ({response, json}))

export const authenticate = (username, password) =>
  fetch(BASE_URL + 'auth/session', {
      headers: basicAuthHeaders(username, password),
      method: 'POST'
    })
    .catch((err) => {
      if (err.message === 'Network request failed') {
        throw new NetworkError(err)
      }
      console.error(err)
    })
    .then(decodeResponse)
    .then((data) => {
      throwOnError(data.response, data.json)
      return data.json.sessionToken
    })
