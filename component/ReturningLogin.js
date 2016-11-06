import React from 'react'
import { View, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import DefaultText from './DefaultText'
import colors from '../util/colors'
import commonStyle from './style.js'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/login'
import Login from './Login'
import LoginOverlay from './LoginOverlay'
import LoginStatus from './LoginStatus'

const style = {
  container: {
    backgroundColor: colors.bristolBlue,
    flex: 1,
    alignItems: 'center',
    padding: 30
  },
  bottomContainer : {
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  welcome: {
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    welcomeText: {
      color: colors.white,
      fontSize: 20,
      marginBottom: 10
    },
    usernameText: {
      color: colors.white,
      fontSize: 26,
      fontFamily: commonStyle.museo700
    }
  },
  infoText: {
    color: colors.white,
    fontSize: 14
  },
  loginButton: {
    container: {
      backgroundColor: colors.white,
      borderRadius: 8,
      alignSelf: 'stretch',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10
    },
    text: {
      color: colors.bristolBlue
    }
  },
  skipButton: {
    container: {
      backgroundColor: colors.transparent,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.white,
      alignSelf: 'stretch',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10
    },
    text: {
      color: colors.white,
      fontSize: 14
    }
  }
}

const ReturningLogin = (props) =>
  <View style={style.container}>
    <View style={style.welcome.container}>
      <DefaultText style={style.welcome.welcomeText}>Welcome back</DefaultText>
      <DefaultText style={style.welcome.usernameText}>{props.loggedInUsername}</DefaultText>
    </View>
    { props.loginFormOpen
      ? undefined
      : <View style={style.bottomContainer}>
          <TouchableHighlight
              style={style.loginButton.container}
              onPress={() => props.openLoginForm(true)}
              underlayColor={colors.offWhite}>
            <DefaultText style={style.loginButton.text}>Login</DefaultText>
          </TouchableHighlight>
          <TouchableHighlight
              style={style.skipButton.container}
              onPress={() => props.logout()}
              underlayColor={colors.bristolBlue3}>
            <DefaultText style={style.skipButton.text}>Log out and browse around</DefaultText>
          </TouchableHighlight>
          <DefaultText style={style.infoText}>You can log back in later to see your</DefaultText>
          <DefaultText style={style.infoText}>details and make payments</DefaultText>
        </View>
    }
    <LoginOverlay/>
    <Login hideUsernameInput={true}/>
    <LoginStatus/>
  </View>

const mapStateToProps = (state) => ({
    ...state.login
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ReturningLogin)
