import color from '../../util/colors'

const initialState = {
  message: '',
  backgroundColor: undefined
}

export const updateStatus = (message, backgroundColor) => ({
  type: 'statusMessage/UPDATE_STATUS',
  message,
  backgroundColor
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'statusMessage/UPDATE_STATUS':
      state = {
        message: action.message,
        backgroundColor: action.backgroundColor || color.bristolBlue
      }
      break

    case 'login/LOGIN_IN_PROGRESS':
      state = {
        message: 'Checking details ...',
        backgroundColor: color.bristolBlue
      }
      break

    case 'login/LOGGED_IN':
      state = {
        message: 'Logged in ✓',
        backgroundColor: color.bristolBlue
      }
      break

    case 'login/LOGGED_OUT':
      state = {
        message: 'Logged out ✓',
        backgroundColor: color.bristolBlue
      }
      break


  }
  return state
}

export default reducer
