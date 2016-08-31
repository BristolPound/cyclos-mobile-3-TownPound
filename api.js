import {encode} from 'base-64'
import merge from './util/merge'

const BASE_URL = 'http://claymaa6.miniserver.com:8080/bristol-pound/'
const NEW_BASE_URL = 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'
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

const new_get = (url, params) =>
  fetch(NEW_BASE_URL + url + (params ? '?' + querystring(params) : ''), {headers})
    .then(response => response.text())
    .then(JSON.parse)

const post = (url, params) =>
  fetch(BASE_URL + url, merge({headers}, {method: 'POST', body: JSON.stringify(params)}))
    .then(response => response.text())
    .then(JSON.parse)

export const getBusinesses = () => {
  let params = {
    fields: [
      "email",
      "id",
      "username",
      "name",
      "address.addressLine1",
      "address.addressLine2",
      "address.zip",
      "address.location",
      "image.url",
      "phone",
      "display",
      "shortDisplay"
    ]
  }
  let businesses = new_get('users', params)
  businesses = businesses.map((business) => {
    let res = {..business, location: business.address.location};
    delete res.address.location;
    return res;
  })
  return businesses;
}


export const getAccount = () =>
  get('accounts')

export const getTransactions = (pageNumber = 1) =>
  get('transaction', {
    pageNumber,
    pageSize: 20
  })

export const putTransaction = (transaction) =>
  post('transaction', transaction)
