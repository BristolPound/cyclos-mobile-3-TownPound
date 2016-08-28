import {encode} from 'base-64'
import merge from './util/merge'

const BASE_URL = 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'
let globalUsername = 'test2'
let globalPassword = 'testing123'

const httpHeaders = () => {
  const headers = new Headers()
  headers.append('Authorization', 'Basic ' + encode(globalUsername + ':' + globalPassword))
  headers.append('Content-Type', 'application/json')
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

export const authenticate = (username, password) =>
  get('auth')
    .then(response => {
      // 'stash' the username / password so that they are used on subsequent requests
      if (!response.expiredPassword) {
        globalPassword = password
        globalUsername = username
      }
      return response
    })
