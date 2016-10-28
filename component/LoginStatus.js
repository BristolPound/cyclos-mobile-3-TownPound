import React from 'react'
import { Animated } from 'react-native'
import { TAB_BAR_HEIGHT } from './tabbar/TabBar'
import DefaultText from './DefaultText'
import color from '../util/colors'
import merge from '../util/merge'
import { connect } from 'react-redux'
import LOGIN_STATUSES from '../stringConstants/loginStatus'

const style = {
  container: {
    position: 'absolute',
    bottom: -TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: color.white
  }
}

const messageForState = (state) => {
  if (state.loginStatus === LOGIN_STATUSES.LOGIN_IN_PROGRESS) {
    return 'Checking details ...'
  }
  if (state.loginStatus === LOGIN_STATUSES.LOGGED_IN) {
    return 'Logged in ✓'
  }
  if (state.loginStatus === LOGIN_STATUSES.LOGIN_FAILED) {
    return state.failureMessage + ' ×'
  }
  return ''
}

class LoginStatus extends React.Component {
  constructor() {
    super()
    this.state = {
      bottom: new Animated.Value(-TAB_BAR_HEIGHT)
    }
  }

  animateBottomTo(value) {
    Animated.timing(this.state.bottom, {
      toValue: value,
      duration: 300
    }).start()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginStatus === LOGIN_STATUSES.LOGIN_IN_PROGRESS) {
      this.animateBottomTo(0)
    }
    if (nextProps.loginStatus === LOGIN_STATUSES.LOGGED_IN) {
      setTimeout(() => this.animateBottomTo(-TAB_BAR_HEIGHT), 2000)
    }
    if (nextProps.loginStatus === LOGIN_STATUSES.LOGIN_FAILED) {
      setTimeout(() => this.animateBottomTo(-TAB_BAR_HEIGHT), 4000)
    }
  }

  render() {
    return (
      <Animated.View style={
          merge(style.container, {
            bottom: this.state.bottom,
            backgroundColor: this.props.loginStatus === LOGIN_STATUSES.LOGIN_FAILED ? color.orange : color.bristolBlue
          })
        }>
        <DefaultText style={style.text}>
          {messageForState(this.props)}
        </DefaultText>
      </Animated.View>
    )
  }
}

const mapStateToProps = (state) => ({...state.login})

export default connect(mapStateToProps)(LoginStatus)
