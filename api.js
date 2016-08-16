import {encode} from 'base-64'
import merge from './util/merge'

const BASE_URL = 'http://claymaa6.miniserver.com:8080/bristol-pound/'
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

const post = (url, params) =>
  fetch(BASE_URL + url, merge({headers}, {method: 'POST', body: JSON.stringify(params)}))
    .then(response => response.text())
    .then(JSON.parse)

export const getBusinesses = () =>
  get('business')

export const getAccount = () =>
  get('account')

export const getTransactions = (pageNumber = 1) =>
  get('transaction', {
    pageNumber,
    pageSize: 20
  })

export const putTransaction = (transaction) =>
  post('transaction', transaction)
