import React from 'react'
import { Animated, BackHandler } from 'react-native'
import animateTo from '../../util/animateTo'
import merge from '../../util/merge'
import { screenWidth } from '../../util/ScreenSizes'
import Colors from '@Colors/colors'
import { TAB_BAR_HEIGHT } from '../tabbar/TabBarStyle'

const modalSlideTime = 300

const style = {
  bottom: TAB_BAR_HEIGHT+ 1.5,
  top: 0,
  position: 'absolute',
  backgroundColor: Colors.offWhite
}

class MenuAction extends React.Component {
  constructor () {
    super()
    this.state = { left: new Animated.Value(-screenWidth), right: new Animated.Value(screenWidth), active: false }
    this.onBackButtonPressBound = this.onBackButtonPress.bind(this)
  }

  onBackButtonPress () {
    this.props.visible && this.props.hideMenuAction()
    return true
  }

  componentDidUpdate (lastProps) {
    if (this.props.visible && !lastProps.visible) {
      this.setState({ active: true })
      animateTo(this.state.left, 0, modalSlideTime, undefined, ()=>{})
      animateTo(this.state.right, 0, modalSlideTime, undefined, ()=>{})
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressBound)
    }
    if(!this.props.visible && lastProps.visible) {
      animateTo(this.state.left, -screenWidth, modalSlideTime, undefined, () => this.setState({ active: false }))
      animateTo(this.state.right, screenWidth, modalSlideTime, undefined, () => {})
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressBound)
    }
  }

  render () {
    return (
      <Animated.View style={merge(style, { left: this.state.left, right: this.state.right })}>
        {this.state.active && this.props.children}
      </Animated.View>
    )
  }
}

export default MenuAction
