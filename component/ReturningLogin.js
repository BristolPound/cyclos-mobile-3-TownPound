import React from 'react'
import { View, TouchableHighlight, Image, StyleSheet } from 'react-native'
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
    flex: 1,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 24
  },
  bottomContainer : {
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  background: {
    ...StyleSheet.absoluteFillObject
  },
  welcome: {
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    welcomeText: {
      color: colors.white,
      fontSize: 20,
      marginTop: 264,
      marginBottom: 10,
      fontSize: 26,
      fontFamily: commonStyle.museo300
    },
    usernameText: {
      color: colors.white,
      fontSize: 30,
      fontFamily: commonStyle.museo700
    }
  },
  infoText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: commonStyle.museo700
  },
  loginButton: {
    container: {
      backgroundColor: colors.white,
      borderRadius: 10,
      alignSelf: 'stretch',
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10
    },
    text: {
      color: colors.bristolBlue2,
      fontSize: 22,
      fontFamily: commonStyle.museo500
    }
  },
  skipButton: {
    container: {
      backgroundColor: colors.transparent,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.white,
      alignSelf: 'stretch',
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18
    },
    text: {
      color: colors.white,
      fontSize: 18,
      fontFamily: commonStyle.museo500
    }
  }
}

const ReturningLogin = (props) =>
  <View style={style.container}>
    <Image style={style.background} source={require('./background.jpg')}/>
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
