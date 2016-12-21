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
import { horizontalAbsolutePosition } from '../util/StyleUtils'

const style = {
  container: {
    ...horizontalAbsolutePosition(0, 0),
    ...commonStyle.shadow,
    alignItems: 'center',
    justifyContent: 'center'
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

  scheduleSlideOut() {
    this.timeout = setTimeout(() => animateTo(this.state.top, screenHeight, 300, undefined, () => {
      this.setState({ height: 0 })
      this.props.updateStatus('')
      this.timeout = undefined
    }), 1600)
  }

  componentDidUpdate(lastProps) {
    if (this.props.message && !lastProps.message) {
      this.setState({ height: TAB_BAR_HEIGHT })
      animateTo(this.state.top, screenHeight - TAB_BAR_HEIGHT, 300)
      this.scheduleSlideOut()
    } else if (this.timeout) {
      clearTimeout(this.timeout)
      this.scheduleSlideOut()
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
