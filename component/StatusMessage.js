import React from 'react'
import { Animated } from 'react-native'
import { TAB_BAR_HEIGHT } from './tabbar/TabBar'
import DefaultText from './DefaultText'
import color from '../util/colors'
import merge from '../util/merge'
import commonStyle from './style'
import { connect } from 'react-redux'
import { updateStatus } from '../store/reducer/statusMessage'
import { screenHeight } from '../util/ScreenSizes'
import animateTo from '../util/animateTo'

const style = {
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyle.shadow
  },
  text: {
    color: color.white
  }
}

class StatusMessage extends React.Component {
  constructor() {
    super()
    this.state = {
      top: new Animated.Value(screenHeight),
      height: 0
    }
  }

  componentDidUpdate(lastProps) {
    if (this.props.message && !lastProps.message) {
      this.setState({ height: TAB_BAR_HEIGHT })
      animateTo(this.state.top, screenHeight - TAB_BAR_HEIGHT, 300)
      setTimeout(() => animateTo(this.state.top, screenHeight, 300, undefined, () => {
        this.setState({ height: 0 })
        this.props.updateStatus('')
      }), 1600)
    }
  }

  render() {
    return (
      <Animated.View style={
          merge(style.container, {
            top: this.state.top,
            backgroundColor: this.props.backgroundColor,
            height: this.state.height
          })
        }>
        <DefaultText style={style.text}>
          {this.props.message}
        </DefaultText>
      </Animated.View>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.statusMessage,
})

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (status) => dispatch(updateStatus(status))
})

export default connect(mapStateToProps, mapDispatchToProps)(StatusMessage)
