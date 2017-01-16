import React from 'react'
import { View } from 'react-native'
import commonStyle from '../style'
import DefaultText from '../DefaultText'
import colors from '../../util/colors'
import Splash from './Splash'

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

const renderWelcomeMessage = (props) => {
  return (
    <View style={style.centerContainer}>
      <DefaultText style={style.welcome.welcomeText}>Welcome back</DefaultText>
      <DefaultText style={style.welcome.usernameText}>{props.loggedInUsername}</DefaultText>
    </View>
  )
}

const renderInfoText = () => {
  return (
    <View style={style.centerContainer}>
      <DefaultText style={style.infoText}>You can log back in later to see your</DefaultText>
      <DefaultText style={style.infoText}>details and make payments</DefaultText>
    </View>
  )
}

class ReturningLogin extends React.Component {
  render() {
    return (
      <Splash loginButtonText='Log in'
        logoutButtonText="I'm just browsing"
        renderWelcomeMessage={renderWelcomeMessage}
        renderInfoText={renderInfoText} />
    )
  }
}

export default ReturningLogin
