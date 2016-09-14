import merge from '../../util/merge'

export const updateMap = (params) => ({
  type: 'map/UPDATE_MAP',
  params
})

const initialState = {
  latitude: 51.455,
  longitude: -2.588,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'map/UPDATE_MAP':
      state = merge(state, action.params)
      break
  }
  return state
}

export default reducer
