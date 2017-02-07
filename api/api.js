import {encode} from 'base-64'
import merge from '../util/merge'
import { throwErrorOnUnexpectedResponse } from './apiError'

const BASE_URL = 'https://bristol-stage.community-currency.org/cyclos/bristolpound/api/'
let globalSessionToken = ''

export const setSessionToken = (newToken) => {
  globalSessionToken = newToken
}

export const deleteSessionToken = () => globalSessionToken = ''

export const setBaseUrl = newUrl => {
  BASE_URL = newUrl
}

const httpHeaders = (requiresAuthorisation) => {
  const headers = new Headers()
  if (globalSessionToken && requiresAuthorisation) {
    headers.append('Session-Token', globalSessionToken)
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

const processResponse = (dispatch, expectedResponse = 200) => (response) => {
  throwErrorOnUnexpectedResponse(response, expectedResponse)
  return response.json()
}


export const get = (url, params, dispatch) => {
  const apiMethod = BASE_URL + url + (params ? '?' + querystring(params) : '')
  return fetch(apiMethod, {headers: httpHeaders(params.requiresAuthorisation)})
    // if the API request was successful, dispatch a message that indicates we have good API connectivity
    .then(processResponse(dispatch))
}

// Will continually load pages of a get request until successCriteria is met.
// successCriteria - should be a function with takes the result of the get request
//                   and returns a boolean as to whether the request is complete. It
//                   will be called on each individual get request.
export const getPages = (config) => {

  let {pageSize, url, params, dispatch, successCriteria, pageNo = 0} = config
  params = merge(params, { page: pageNo })

  return new Promise(function(resolve, reject) {
    get(url, params, dispatch)
      .then(results => {
        if (results.length < pageSize || successCriteria === undefined || successCriteria(results, pageNo)) {
          resolve(results)
        } else {
          getPages(merge(config, {pageNo: pageNo + 1}))
            .then(nextResults => resolve(results.concat(nextResults)))
            .catch(reject)
        }
      })
      .catch(reject)
  })
}

export const post = (url, params, dispatch, expectedResponse = 201) =>
  fetch(BASE_URL + url, merge({ headers: httpHeaders(params.requiresAuthorisation) },
		{ method: 'POST', body: JSON.stringify(params) }))
    .then(processResponse(dispatch, expectedResponse))

export const authenticate = (username, password, dispatch) =>
  fetch(BASE_URL + 'auth/session', {
    headers: basicAuthHeaders(username, password),
    method: 'POST'
  })
  .then(processResponse(dispatch))
  .then((results) => {
    globalSessionToken = results.sessionToken
    return results.sessionToken
  })
