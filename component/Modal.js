import React from 'react'
import { Dimensions, Animated } from 'react-native'
import animateTo from '../util/animateTo'
import merge from '../util/merge'
import marginOffset from '../util/marginOffset'

const screenHeight = marginOffset(Dimensions.get('window').height)

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
    this.state = { top: new Animated.Value(screenHeight) }
  }
  componentDidUpdate(lastProps) {
    if (this.props.visible && !lastProps.visible) {
      animateTo(this.state.top, 0, 300)
    }
    if (!this.props.visible && lastProps.visible) {
      animateTo(this.state.top, screenHeight, 300)
    }
  }
  render() {
    return (
      <Animated.View style={merge(style, { top: this.state.top })}>
        {this.props.children}
      </Animated.View>
    )
  }
}

export default Modal
