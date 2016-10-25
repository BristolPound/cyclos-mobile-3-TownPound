import merge from '../../util/merge'

const initialState = {
  status: true,
  failedActions: []
}

export const connectivityChanged = (status) => (dispatch, getState) => {
  if (status) {
    getState().networkConnection.failedActions.forEach(dispatch)
  }
  dispatch ({
    type: 'networkConnection/CONNECTION_CHANGED',
    status
  })
}

export const addFailedAction = (failedAction) => ({
  type: 'networkConnection/ACTION_FAILED',
  failedAction
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'networkConnection/CONNECTION_CHANGED':
      state = merge(state, {
        status: action.status,
        failedActions: []
      })
      break
    case 'networkConnection/ACTION_FAILED':
      if (!state.failedActions.find(a => a.type === action.failedAction.type)) {
        state = merge(state, {
          failedActions: [...state.failedActions, action.failedAction]
        })
      }
      break
  }
  return state
}

export default reducer
