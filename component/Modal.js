import React from 'react'
import { Animated, BackAndroid } from 'react-native'
import animateTo from '../util/animateTo'
import merge from '../util/merge'
import { screenHeight } from '../util/ScreenSizes'

const style = {
  left: 0,
  right: 0,
  bottom: 0,
  position: 'absolute',
  backgroundColor: 'white',
}

class Modal extends React.Component {
  constructor() {
    super()
    this.state = { top: new Animated.Value(screenHeight), active: false }
    this.onBackButtonPressBound = this.onBackButtonPress.bind(this)
  }
  onBackButtonPress() {
    this.props.hideModal && this.props.hideModal()
    return true
  }
  componentDidUpdate(lastProps) {
    if (this.props.visible && !lastProps.visible) {
      this.setState({ active: true })
      animateTo(this.state.top, 0, 300)
      BackAndroid.addEventListener('hardwareBackPress', this.onBackButtonPressBound)
    }
    if (!this.props.visible && lastProps.visible) {
      animateTo(this.state.top, screenHeight, 300, undefined, () => this.setState({ active: false }))
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackButtonPressBound)
    }
  }
  render() {
    return (
      <Animated.View style={merge(style, { top: this.state.top })}>
        {this.state.active && this.props.children}
      </Animated.View>
    )
  }
}

export default Modal
