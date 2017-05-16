import commonStyle from '../style'
import colors from '../../util/colors'

const style = {
  welcome: {
    welcomeText: {
      color: colors.white,
      fontSize: 26,
      fontFamily: commonStyle.museo300
    },
    usernameText: {
      color: colors.white,
      fontSize: 30,
      fontFamily: commonStyle.museo700
    },
  },
  infoText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: commonStyle.museo700
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center'
  }
}

export default style
