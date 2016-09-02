import {encode} from 'base-64'
import merge from './util/merge'

const BASE_URL = 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'
const USER = 'test1'
const PASS = 'testing123'

const headers = new Headers()
headers.append('Authorization', 'Basic ' + encode(USER + ':' + PASS))
headers.append('Content-Type', 'application/json')

const querystring = params =>
  Object.keys(params).map(key => key + '=' + params[key]).join('&')

const get = (url, params) =>
  fetch(BASE_URL + url + (params ? '?' + querystring(params) : ''), {headers})
    .then(response => response.text())
    .then(JSON.parse)
    .catch(console.error)

const post = (url, params) =>
  fetch(BASE_URL + url, merge({headers}, {method: 'POST', body: JSON.stringify(params)}))
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
  .then((res) => {
    var transaction = {
      ...payment,
      type: res.paymentTypes[0].id
    }
    return post('self/payments', transaction)
  })
