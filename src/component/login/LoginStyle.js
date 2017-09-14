import Colors from '@Colors/colors'
import { horizontalAbsolutePosition } from '../../util/StyleUtils'
import commonStyle from '../style'

const styles = {
  outerContainer: {
    ...horizontalAbsolutePosition(0, 0),
    height: 244
  },
  loginContainer: {
    backgroundColor: 'white',
    ...commonStyle.shadow,
    flexDirection: 'column'
  },
  loginButton: {
    height: 68,
    padding: 20,
  },
  loginButtonText: {
    fontSize: 24,
    textAlign: 'center'
  },
  input: {
    height: 68,
    fontSize: 20,
    color: Colors.primaryBlue,
    backgroundColor: 'white',
    textAlign: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray5
  },
  storePasswordContainer: {
    height: 40,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkbox: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxLeftText: {
    fontSize: 14,
    color: Colors.primaryBlue
  },
  checkboxImage: {
    tintColor: Colors.primaryBlue
  }
}

export default styles
