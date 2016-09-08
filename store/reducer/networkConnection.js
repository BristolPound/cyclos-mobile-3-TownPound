import merge from '../../util/merge'
// import { _get, _post, _authenticate } from '../../api'
// import NetworkError from '../../networkError'
// import { sessionTokenUpdated } from './login'

const initialState = {
  status: true
}

export const connectionFailed = () => ({
  type: 'networkConnection/CONNECTION_FAILED'
})

export const successfulConnection = () => ({
  type: 'networkConnection/CONNECTION_SUCCESSFUL'
})

// export const get = (url, params) =>
//   (dispatch, getState) =>
//     _get(url, params, getState().login.sessionToken)
//       .then(() => dispatch(successfulConnection()))
//       .catch((err) => {
//         if (err instanceof NetworkError) {
//           dispatch(connectionFailed())
//         }
//       })
//
// export const post = (url, params) =>
//   (dispatch, getState) =>
//     _post(url, params, getState().login.sessionToken)
//       .then((sessionToken) => dispatch(successfulConnection(sessionToken)))
//       .catch((err) => {
//         if (err instanceof NetworkError) {
//           dispatch(connectionFailed())
//         }
//       })
//
// export const authenticate = (username, password) =>
//   (dispatch) =>
//     _authenticate(username, password)
//       .then((sessionToken) => {
//         dispatch(successfulConnection())
//         dispatch(sessionTokenUpdated(sessionToken))
//       })
//       .catch((err) => {
//         if (err instanceof NetworkError) {
//           dispatch(connectionFailed())
//         }
//       })

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'networkConnection/CONNECTION_FAILED':
      state = merge(state, {
        status: false
      })
    break
    case 'networkConnection/CONNECTION_SUCCESSFUL':
      state = merge(state, {
        status: true
      })
    break
  }
  return state
}

export default reducer
