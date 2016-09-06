import {encode} from 'base-64'
import merge from './util/merge'
import {throwOnError} from './apiError'
import NetworkError from './networkError'

const BASE_URL = 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'
let sessionToken = ''
export const PAGE_SIZE = 20
export const formatDate = (stringDate) => (new Date(stringDate)).toJSON()

const httpHeaders = () => {
  const headers = new Headers()
  if (sessionToken) {
    headers.append('Session-Token', sessionToken)
  }
  headers.append('Accept', 'application/json')
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

const get = (url, params) =>
  fetch(BASE_URL + url + (params ? '?' + querystring(params) : ''), {headers: httpHeaders()})
    .then(response => response.text())
    .then(JSON.parse)
    .catch(console.error)

const post = (url, params) =>
  fetch(BASE_URL + url, merge({headers: httpHeaders()}, {method: 'POST', body: JSON.stringify(params)}))
    .then(response => response.text())
    .then(JSON.parse)

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

export const getAccount = () =>
  get('self/accounts', {
    fields: ['status.balance']
  }).then((res) => res[0].status.balance) // get first item in list for now


export const getTransactions = (beforeTransaction) =>
  get('self/accounts/member/history', merge({
    fields: [
      'id',
      'transactionNumber',
      'date',
      'description',
      'amount',
      'type',
      'relatedAccount'
    ],
    page: 0,
    pageSize: PAGE_SIZE
  }, beforeTransaction ? {
    datePeriod: ',' + formatDate(beforeTransaction.date),
    excludedIds: beforeTransaction.id
  } : {}))

export const putTransaction = (payment) =>
  get('self/payments/data-for-perform', {
      to: payment.subject,
      fields: 'paymentTypes.id'
  })
  .then((res) =>
    post('self/payments', ({
      ...payment,
      type: res.paymentTypes[0].id
    }))
  )

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
    })
    .then(decodeResponse)
    .then((data) => {
      throwOnError(data.response, data.json)
      return data
    })
    .then(({json}) => {
      // 'stash' the sessionToken
      // TODO: Investigate how long sessionTokens last for, and ensure that
      // if the token expires, the login flow is invoked once again
      sessionToken = json.sessionToken
    })
