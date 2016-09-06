import merge from '../../util/merge'

const initialState = {
  networkConnection: true
}

export const networkConnectionChanged = (status) => ({
  type: 'status/NETWORK_CONNECTION',
  status
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'status/NETWORK_CONNECTION':
      state = merge(state, {
        networkConnection: action.status
      })
      break
  }
  return state
}

export default reducer
