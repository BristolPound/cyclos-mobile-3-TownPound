import React from 'react'
import { View, TouchableHighlight, Animated,  Easing, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import DefaultText from '../DefaultText'
import colors from '../../util/colors'
import merge from '../../util/merge'
import commonStyle from './../style.js'
import  { margin, absolutePosition } from '../../util/StyleUtils'
import { bindActionCreators } from 'redux'
import * as actions from '../../store/reducer/login'
import PLATFORM from '../../util/Platforms'

const gapSize = Dimensions.get('window').height / 2 - 170

const style = {
  container: {
    flex: 1,
    alignItems: 'center'
  },
  bottomContainer : {
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
    flex: 1,
    left: 0,
    right: 0
  },
  background: {
    ...absolutePosition(),
    height: Dimensions.get('window').height,
    backgroundColor: colors.bristolBlue2
  },
  loginButton: {
    container: {
      backgroundColor: colors.white,
      borderRadius: 10,
      alignSelf: 'stretch',
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      ...margin(gapSize, 20, 10, 20),
    },
    text: {
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
      ...margin(0, 20, 18, 20),
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
      backgroundOffset: new Animated.Value(0),
      showButtons: true
    }
  }

  componentDidMount() {
    this.animateBackground()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginFormOpen && PLATFORM.isAndroid()) {
      this.setState({ showButtons: false})
    }
    if (!nextProps.loginFormOpen && this.props.loginFormOpen) {
      setTimeout(() => this.setState({ showButtons: true }), 80)
    }
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
          source={require('../../assets/background.jpg')}/>
        { this.state.showButtons
          ? <View style={style.bottomContainer}>
              { this.props.renderWelcomeMessage(this.props) }
              <TouchableHighlight
                  style={style.loginButton.container}
                  onPress={this.props.connection ? () => this.props.openLoginForm(true) : undefined}
                  underlayColor={colors.offWhite}>
                <DefaultText style={merge(style.loginButton.text, { color: this.props.connection ? colors.bristolBlue2 : colors.offWhite })}>
                  {this.props.connection ? this.props.loginButtonText : 'No internet connection'}
                </DefaultText>
              </TouchableHighlight>
              <TouchableHighlight
                  style={style.skipButton.container}
                  onPress={this.props.logout}
                  underlayColor={colors.bristolBlue3}>
                <DefaultText style={style.skipButton.text}>{this.props.logoutButtonText}</DefaultText>
              </TouchableHighlight>
              { this.props.renderInfoText(this.props) }
            </View>
          : undefined
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
    ...state.login,
    connection: state.networkConnection.status
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
