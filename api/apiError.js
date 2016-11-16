export const UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS'
export const PERMISSION_DENIED = 'PERMISSION_DENIED'
export const UNEXPECTED_DATA = 'UNEXPECTED_DATA'
export const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
export const INPUT_ERROR = 'INPUT_ERROR'
export const UNEXPECTED_HTTP_RESPONSE = 'UNEXPECTED_HTTP_RESPONSE'

function APIError (type, data) {
  Error.call(this)
  this.message = 'An error response was returned from the Cyclos API'
  this.name = 'APIError'
  this.type = type
  this.response = data.response
  this.json = data.json
}

APIError.prototype.__proto__ = Error.prototype

export const throwErrorOnUnexpectedResponse = (data, expectedResponse = 200) => {
  if (data.response.status !== expectedResponse) {
    if (data.response.status === 401) {
      throw new APIError(UNAUTHORIZED_ACCESS, data)
    } else if (data.response.status === 403) {
      throw new APIError(PERMISSION_DENIED, data)
    } else if (data.response.status === 404) {
      throw new APIError(UNEXPECTED_DATA, data)
    } else if (data.response.status === 500) {
      throw new APIError(UNEXPECTED_ERROR, data)
    } else if (data.response.status === 422) {
      throw new APIError(INPUT_ERROR, data)
    } else {
      throw new APIError(UNEXPECTED_HTTP_RESPONSE, data)
    }
  }
}

export default APIError
