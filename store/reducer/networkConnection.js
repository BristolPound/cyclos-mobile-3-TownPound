import merge from '../../util/merge'

const initialState = {
  status: true
}

export const connectionFailed = () => ({
  type: 'networkConnection/CONNECTION_FAILED'
})

export const successfulConnection = () => ({
  type: 'networkConnection/CONNECTION_SUCCESSFUL'
})

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
