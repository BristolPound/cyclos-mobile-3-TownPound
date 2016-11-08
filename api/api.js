import {encode} from 'base-64'
import merge from '../util/merge'
import ApiError, { UNAUTHORIZED_ACCESS, throwOnError } from './apiError'

import {connectivityChanged} from '../store/reducer/networkConnection'
import {loggedOut} from '../store/reducer/login'

const BASE_URL = 'https://bristol-stage.community-currency.org/cyclos/api/'
let globalSessionToken = ''

export const setBaseUrl = newUrl => {
  BASE_URL = newUrl
}

const httpHeaders = () => {
  const headers = new Headers()
  if (globalSessionToken) {
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

// decodes the response via the json() function, which returns a promise, combining
// the results with the original response object. This allows access to both
// response data (e.g. status code) and application level data.
const decodeResponse =
  response => response.json()
    .then(json => ({response, json}))

const querystring = params =>
  Object.keys(params).map(key => key + '=' + params[key]).join('&')

const dispatchSuccessfulConnection = dispatch => response => {
  dispatch(connectivityChanged(true))
  return response
}

const maybeDispatchFailure = dispatch => err => {
  if (err instanceof ApiError && err.type === UNAUTHORIZED_ACCESS) {
    dispatch(loggedOut())
  } else {
    dispatch(connectivityChanged(false))
  }
  throw err
}

export const get = (url, params, dispatch) => {
  const apiMethod = BASE_URL + url + (params ? '?' + querystring(params) : '')
  if (__DEV__) {
    console.log(apiMethod)
  }

  return fetch(apiMethod, {headers: httpHeaders()})
    // if the API request was successful, dispatch a message that indicates we have good API connectivity
    .then(dispatchSuccessfulConnection(dispatch))
    // decode JSON and HTTP status
    .then(decodeResponse)
    .then((data) => {
      // detect general HTTP status errors, throwing them as APIError instances
      throwOnError(data.response, data.json)
      return data.json
    })
    // handle generic failures
    .catch(maybeDispatchFailure(dispatch))
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
  fetch(BASE_URL + url, merge({headers: httpHeaders()}, {method: 'POST', body: JSON.stringify(params)}))
    .then(dispatchSuccessfulConnection(dispatch))
    .then(decodeResponse)
    .then((data) => {
      throwOnError(data.response, data.json, expectedResponse)
      return data.response
    })
    .catch(maybeDispatchFailure(dispatch))

// this API method is a special case as it is the only one which does not
// use the global session key.
export const authenticate = (username, password, dispatch) =>
  fetch(BASE_URL + 'auth/session', {
    headers: basicAuthHeaders(username, password),
    method: 'POST'
  })
  .then(dispatchSuccessfulConnection(dispatch))
  .then(decodeResponse)
  .then((data) => {
    throwOnError(data.response, data.json)
    globalSessionToken = data.json.sessionToken
    return data.json.sessionToken
  })
  .catch(maybeDispatchFailure(dispatch))
