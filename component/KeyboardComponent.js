import React from 'react'
import { Keyboard } from 'react-native'
import PLATFORM from '../util/Platforms'

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
class KeyboardComponent extends React.Component {
  constructor() {
    super()
    this.state = {keyboardHeight: 0}
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
    this.setState({keyboardHeight: e.endCoordinates.height})
  }

  keyboardDidHide() {
    this.setState({keyboardHeight: 0})
  }
}

export default KeyboardComponent
