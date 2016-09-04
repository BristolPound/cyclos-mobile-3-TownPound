import {encode} from 'base-64'
import merge from './util/merge'
import createError from './apiError'

const BASE_URL = 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'
let sessionToken = ''

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


export const getTransactions = (page = 0) =>
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
  })

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

const checkStatusCode = (data) => {
  if (data.response.status !== 400) {
    throw new createError(data.response, data.json)
  }
  return data
}

export const authenticate = (username, password) =>
  fetch(BASE_URL + 'auth/session', {
      headers: basicAuthHeaders(username, password),
      method: 'POST'
    })
    .then(decodeResponse)
    .then(checkStatusCode)
    .then(({json}) => {
      // 'stash' the sessionToken
      sessionToken = json.sessionToken
    })
