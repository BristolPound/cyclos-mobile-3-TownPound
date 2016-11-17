import React from 'react'
import { Animated } from 'react-native'
import { TAB_BAR_HEIGHT } from './tabbar/TabBar'
import DefaultText from './DefaultText'
import color from '../util/colors'
import merge from '../util/merge'
import commonStyle from './style'
import { connect } from 'react-redux'
import { updateStatus } from '../store/reducer/statusMessage'

const style = {
  container: {
    position: 'absolute',
    bottom: -TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
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
      bottom: new Animated.Value(-TAB_BAR_HEIGHT)
    }
  }

  animateBottomTo(value, callback) {
    Animated.timing(this.state.bottom, {
      toValue: value,
      duration: 300
    }).start(callback)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== '') {
      this.animateBottomTo(0)
      setTimeout(() => this.animateBottomTo(-TAB_BAR_HEIGHT, () => nextProps.updateStatus('')), 2000)
    }
  }

  render() {
    return (
      <Animated.View style={
          merge(style.container, {
            bottom: this.state.bottom,
            backgroundColor: this.props.backgroundColor
          })
        }>
        <DefaultText style={style.text}>
          {this.props.message}
        </DefaultText>
      </Animated.View>
    )
  }
}

const mapStateToProps = (state) => ({...state.statusMessage})

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (status) => dispatch(updateStatus(status))
})

export default connect(mapStateToProps, mapDispatchToProps)(StatusMessage)
