export const UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS'
export const PERMISSION_DENIED = 'PERMISSION_DENIED'
export const UNEXPECTED_DATA = 'UNEXPECTED_DATA'
export const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
export const INPUT_ERROR = 'INPUT_ERROR'
export const UNEXPECTED_HTTP_RESPONSE = 'UNEXPECTED_HTTP_RESPONSE'

function APIError (type, response, json) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = 'An error response was returned from the Cyclos API'
  this.name = 'APIError'
  this.type = type
  this.response = response
  this.json = json
}

APIError.prototype.__proto__ = Error.prototype

export const throwOnError = (response, json, expectedResponse = 200) => {
  if (response.status === 401) {
    throw new APIError(UNAUTHORIZED_ACCESS, response, json)
  } else if (response.status === 403) {
    throw new Error(PERMISSION_DENIED, response, json)
  } else if (response.status === 404) {
    throw new APIError(UNEXPECTED_DATA, response, json)
  } else if (response.status === 500) {
    throw new APIError(UNEXPECTED_ERROR, response, json)
  } else if (response.status === 422) {
    throw new APIError(INPUT_ERROR, response, json)
  } else if (response.status !== expectedResponse) {
    throw new Error(UNEXPECTED_HTTP_RESPONSE)
  }
}

export default APIError
