export const UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS'
export const PERMISSION_DENIED = 'PERMISSION_DENIED'
export const UNEXPECTED_DATA = 'UNEXPECTED_DATA'
export const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
export const UNEXPECTED_HTTP_RESPONSE = 'UNEXPECTED_HTTP_RESPONSE'

function APIError (type, json) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = 'An error response was returned from the Cyclos API'
  this.name = 'APIError'
  this.type = type
  this.json = json
}

APIError.prototype.__proto__ = Error.prototype

export const throwOnError = (response, json) => {
  if (response.status === 401) {
    throw new APIError(UNAUTHORIZED_ACCESS, json)
  } else if (response.status === 403) {
    throw new Error(PERMISSION_DENIED, json)
  } else if (response.status === 404) {
    throw new APIError(UNEXPECTED_DATA, json)
  } else if (response.status === 500) {
    throw new APIError(UNEXPECTED_ERROR, json)
  } else if (response.status !== 200) {
    throw new Error(UNEXPECTED_HTTP_RESPONSE)
  }
}

export default APIError
