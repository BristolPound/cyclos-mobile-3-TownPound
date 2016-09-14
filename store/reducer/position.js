export const updatePosition = (position) => ({
  type: 'position/POSITION_UPDATED',
  position
})

const reducer = (state = { latitude: 51.455, longitude:  -2.588 }, action) => {
  switch (action.type) {
    case 'position/POSITION_UPDATED':
      state = action.position
      break
  }
  return state
}

export default reducer
