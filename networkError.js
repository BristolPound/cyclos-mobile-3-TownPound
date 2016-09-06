
function NetworkError(wrappedError) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.wrappedError = wrappedError
}

NetworkError.prototype.__proto__ = Error.prototype

export default NetworkError
