const initialState = {
  version: null
}


export const updateVersion = (version) => ({
  type: 'version/UPDATE_VERSION',
  version
})

export const resetStore = () => ({
  type: 'RESET'
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'version/UPDATE_VERSION':
      state = {
        version: action.version
      }
      break
  }
  return state
}

export default reducer
