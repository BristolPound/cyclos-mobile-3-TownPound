import React from 'react'
import { View, TouchableHighlight, StyleSheet, Animated,  Easing, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import DefaultText from '../DefaultText'
import marginOffset from '../../util/marginOffset'
import colors from '../../util/colors'
import merge from '../../util/merge'
import commonStyle, { padding, margin } from './../style.js'
import { bindActionCreators } from 'redux'
import * as actions from '../../store/reducer/login'
import Login from './Login'
import LoginOverlay from './LoginOverlay'
import StatusMessage from '../StatusMessage'

const style = {
  container: {
    ...padding(0, 30, 24, 30),
    flex: 1,
    alignItems: 'center'
  },
  bottomContainer : {
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  background: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    left: 0,
  },
  welcome: {
    container: {
      ...margin(marginOffset(254), 0, 10, 0),
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
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

class Splash  extends React.Component {
  constructor() {
    super()
    this.state = {
      backgroundOffset: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.animateBackground()
  }

  animateBackground() {
    const animateBackgroundTo = toValue =>
      Animated.timing(this.state.backgroundOffset, {
        toValue,
        duration: 240000,
        easing: Easing.linear
      })

    // create a looping animation for the background
    Animated.sequence([
      // background image is 7900px wide. Assuming the widest screem is <1080 (6 plus)
      animateBackgroundTo(-(7900 - 1080)),
      animateBackgroundTo(0)
    ]).start(event => {
      if (event.finished) {
        this.animateBackground()
      }
    })
  }

  render()  {
    return (
      <View style={style.container}>
        <Animated.Image
          style={merge(style.background, {
            transform: [
              {translateX: this.state.backgroundOffset}
            ]
          })}
          resizeMode='stretch'
          source={require('../background.jpg')}/>
        <View style={style.welcome.container}>
          { this.props.renderWelcomeMessage(this.props) }
        </View>
        { this.props.loginFormOpen
          ? undefined
          : <View style={style.bottomContainer}>
              <TouchableHighlight
                  style={style.loginButton.container}
                  onPress={() => this.props.openLoginForm(true)}
                  underlayColor={colors.offWhite}>
                <DefaultText style={style.loginButton.text}>{this.props.loginButtonText}</DefaultText>
              </TouchableHighlight>
              <TouchableHighlight
                  style={style.skipButton.container}
                  onPress={this.props.logout}
                  underlayColor={colors.bristolBlue3}>
                <DefaultText style={style.skipButton.text}>{this.props.logoutButtonText}</DefaultText>
              </TouchableHighlight>
              { this.props.renderInfoText(this.props) }
            </View>
        }
        <LoginOverlay/>
        <Login hideUsernameInput={this.props.hideUsernameInput}/>
        <StatusMessage/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
    ...state.login
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
