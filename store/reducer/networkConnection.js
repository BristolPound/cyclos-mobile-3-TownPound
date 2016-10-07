import merge from '../../util/merge'

const initialState = {
  status: true
}

export const connectivityChanged = (status) => ({
  type: 'networkConnection/CONNECTION_CHANGED',
  status
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'networkConnection/CONNECTION_CHANGED':
      state = merge(state, {
        status: action.status
      })
    break
  }
  return state
}

export default reducer
