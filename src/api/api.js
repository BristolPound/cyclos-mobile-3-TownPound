import _ from 'lodash'
import {encode} from 'base-64'
import merge from '../util/merge'
import cyclosUrl from '../util/config'
import { throwErrorOnUnexpectedResponse } from './apiError'
import Config from '@Config/config'
import { flavour, default_config, configurations } from '@Config/config'

let globalSessionToken = ''

export const setSessionToken = (newToken) => {
  globalSessionToken = newToken
}

export const deleteSessionToken = () => globalSessionToken = ''

export const getBaseUrl = (flavourRequested) => {

    const selectedConfig = (!flavourRequested || flavourRequested == flavour)
        ? Config
        : _.has(configurations, flavourRequested)
        ? configurations[flavourRequested]
        : cyclosUrl(_.merge({}, default_config))

    return selectedConfig.CYCLOS.url
}

let BASE_URL = getBaseUrl()

export const setBaseUrl = newUrl => {
  BASE_URL = newUrl
}

const httpCommonHeaders = () => {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  if (Config.CYCLOS.channel) {
      const channel = Config.CYCLOS.channel.replace('{CHANNEL_SECRET}', Config.secrets.CHANNEL_SECRET)
      headers.append('Channel', channel)
  }
  return headers
}

const httpHeaders = (requiresAuthorisation) => {
  const headers = httpCommonHeaders()
  if (globalSessionToken && requiresAuthorisation) {
    headers.append('Session-Token', globalSessionToken)
  }
  return headers
}

const basicAuthHeaders = (username, password) => {
  const headers = httpCommonHeaders()
  headers.append('Authorization', 'Basic ' + encode(username + ':' + password))
  return headers
}

const querystring = params =>
  Object.keys(params).map(key => key + '=' + params[key]).join('&')

const processResponse = (dispatch, apiMethod = '', errorOptions = {}, expectedResponse = 200) => (response) => {
  throwErrorOnUnexpectedResponse(dispatch, apiMethod, errorOptions, response, expectedResponse)
  return response.json()
}


export const get = (url, params, dispatch, errorOptions = {}) => {
  const apiMethod = BASE_URL + url + (params ? '?' + querystring(params) : '')
  return fetch(apiMethod, {headers: httpHeaders(params.requiresAuthorisation)})
    // if the API request was successful, dispatch a message that indicates we have good API connectivity
    .then(processResponse(dispatch, apiMethod, errorOptions))
}

// Will continually load pages of a get request until successCriteria is met.
// successCriteria - should be a function with takes the result of the get request
//                   and returns a boolean as to whether the request is complete. It
//                   will be called on each individual get request.
export const getPages = (config) => {

  let {pageSize, url, params, dispatch, successCriteria, pageNo = 0} = config
  params = merge(params, { page: pageNo })

  return new Promise(function (resolve, reject) {
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

export const post = (url, params, dispatch, expectedResponse = 201, errorOptions = {}) => {
  const apiMethod = BASE_URL + url
  return fetch(apiMethod, merge({ headers: httpHeaders(params.requiresAuthorisation) },
		{ method: 'POST', body: JSON.stringify(params) }))
  .then(processResponse(dispatch, apiMethod, errorOptions, expectedResponse))
}

export const authenticate = (username, password, dispatch) => {
  const apiMethod = BASE_URL + 'auth/session'
  return fetch(apiMethod, {
    headers: basicAuthHeaders(username, password),
    method: 'POST'
  })
  .then(processResponse(dispatch, apiMethod, {logoutOnUnauthorised: false}))
  .then((results) => {
    globalSessionToken = results.sessionToken
    return results.sessionToken
  })
}
