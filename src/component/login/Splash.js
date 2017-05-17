import React from 'react'
import { View, TouchableHighlight, Animated,  Easing, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import DefaultText from '../DefaultText'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
import { bindActionCreators } from 'redux'
import * as actions from '../../store/reducer/login'
import PLATFORM from '../../util/Platforms'
import style from './SplashStyle'
import Images from '@Assets/images'

const background = Images.background
const screenWidth = Dimensions.get('window').width

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
    // background image is 2028px wide
    const slideDistance = 2028 - screenWidth

    const animateBackgroundTo = toValue =>
      Animated.timing(this.state.backgroundOffset, {
        toValue,
        duration: 75 * slideDistance,
        easing: Easing.linear
      })

    // create a looping animation for the background
    Animated.sequence([
      animateBackgroundTo(-slideDistance),
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
          resizeMode='cover'
          source={background}/>
        { this.state.showButtons
          ? <View style={style.bottomContainer}>
              { this.props.renderWelcomeMessage(this.props) }
              <TouchableHighlight
                  style={style.loginButton.container}
                  onPress={this.props.connection ? () => this.props.openLoginForm(true) : undefined}
                  underlayColor={Colors.offWhite}>
                <DefaultText style={merge(style.loginButton.text, { color: this.props.connection ? Colors.primaryBlue2 : Colors.offWhite })}>
                  {this.props.connection ? this.props.loginButtonText : 'No internet connection'}
                </DefaultText>
              </TouchableHighlight>
              <TouchableHighlight
                  style={style.skipButton.container}
                  onPress={this.props.logout}
                  underlayColor={Colors.primaryBlue3}>
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
