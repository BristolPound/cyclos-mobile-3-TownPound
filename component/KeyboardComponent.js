import React from 'react'
import { Keyboard, Animated } from 'react-native'
import PLATFORM from '../util/Platforms'
import animateTo from '../util/animateTo'

/**
 * Offer common keyboard resizing rules to smooth out the difference between Android and iOS.
 * This has been extracted as base class from Login.js that can be inherited by components that need the resizing.
 *
 * Two limitations:
 *  * KeyboardAvoidingView has been released in the newest version of React-Native, and once our lagging android
 *  version catches up, it should remove the need for this class.
 *  * React design philosophy is to favour composition over inheritance.  Alternative solutions include a separate
 *  resizing component to sit below the component we wish to continue to display.
 */

 // For some reason works for login but not for SendMoney
class KeyboardComponent extends React.Component {
  constructor() {
    super()
    this.keyboardOpen = false
    this.state = { keyboardHeight: new Animated.Value(0) }
  }

  componentWillMount() {
    // On iOS the keyboard is overlaid on top of the content,
    // while on android everything is moved up to make space
    if (PLATFORM.isIOS()) {
      this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this))
      this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this))
    }
  }

  componentWillUnmount() {
    if (PLATFORM.isIOS()) {
      this.keyboardShowListener.remove()
      this.keyboardHideListener.remove()
    }
  }

  keyboardDidShow(e) {
    animateTo(this.state.keyboardHeight, e.endCoordinates.height, 300, undefined, () => this.props.setOverlayOpen && this.props.setOverlayOpen(true))
    this.keyboardOpen = true
  }

  keyboardDidHide() {
    // Do nothing as this is too slow to trigger anyway
  }
}

export default KeyboardComponent
