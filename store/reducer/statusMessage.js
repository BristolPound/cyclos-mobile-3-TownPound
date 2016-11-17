import color from '../../util/colors'

const initialState = {
  message: '',
  backgroundColor: undefined
}

export const ERROR_SEVERITY = {
  MILD: color.bristolBlue,
  SEVERE: color.orange
}

export const unknownError = (err) => (dispatch) => {
  if (__DEV__) {
    console.error(err)
  }
  dispatch(updateStatus('Unknown error', ERROR_SEVERITY.SEVERE))
}

export const updateStatus = (message, severity = ERROR_SEVERITY.MILD) => ({
  type: 'statusMessage/UPDATE_STATUS',
  message,
  severity
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'statusMessage/UPDATE_STATUS':
      state = {
        message: action.message,
        backgroundColor: action.severity
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
