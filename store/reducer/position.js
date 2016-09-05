import haversine from 'haversine'

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

export const selectClosestBusinessId = (businesses, position) => {
  let closestId
  let shortestDistance
  businesses.filter(b => b.address)
    .forEach(b => {
      const distance = haversine(position.coords, b.address.location)
      if (!shortestDistance || distance < shortestDistance) {
        closestId = b.id
        shortestDistance = distance
      }
    })
  return closestId
}

export default reducer
