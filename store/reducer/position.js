export const updatePosition = (position) => ({
  type: 'position/POSITION_UPDATED',
  position
})

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'position/POSITION_UPDATED':
      state = action.position
      break
  }
  return state
}

export default reducer
