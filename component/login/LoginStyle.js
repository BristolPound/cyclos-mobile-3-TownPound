import colors from '../../util/colors'
import { horizontalAbsolutePosition } from '../../util/StyleUtils'
import commonStyle from '../style'

const styles = {
  outerContainer: {
    ...horizontalAbsolutePosition(0, 0),
    height: 204
  },
  loginContainer: {
    backgroundColor: 'white',
    ...commonStyle.shadow
  },
  loginButton: {
    height: 68,
    padding: 20,
  },
  loginButtonText: {
    fontSize: 24,
    textAlign: 'center'
  },
  loginAttemptLeftText: {
    fontSize: 18
  },
  input: {
    height: 68,
    fontSize: 20,
    color: colors.bristolBlue,
    backgroundColor: 'white',
    textAlign: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray5
  }
}

export default styles
