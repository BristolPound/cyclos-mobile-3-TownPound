import React from 'react'
import { Animated, PanResponder, View } from 'react-native'
import animateTo from '../../util/animateTo'
import _ from 'lodash'

class Carousel extends React.Component {
  constructor(props) {
    super()

    this.state = ({
      leftOffset: new Animated.Value(this.leftOffsetAtIndex(props.pageIndex, props)),
    })
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => !this.busy,

      onPanResponderGrant: () => {
        this.leftOffsetAtPanStart = this.state.leftOffset._value
        this.setState({ leftOffset: new Animated.Value(this.state.leftOffset._value) })
        this.props.onTouchStart && this.props.onTouchStart()
      },

      onPanResponderMove: (evt, gestureState) => {
        const newLocation = this.getLocationAfterMove(gestureState.dx)
        this.setState({
          leftOffset: new Animated.Value(newLocation)
        })
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx <= 3 && this.props.onPress) {
          const pressLocation = evt.nativeEvent.pageX
          const pressIndex = Math.floor((pressLocation - this.state.leftOffset._value) / this.props.itemWidth)
          this.props.onPress(pressIndex)
        } else {
          this.onRelease(gestureState.dx)
        }
      },

      onPanResponderTerminate: () => this.onRelease(),
    })
  }

  onRelease(dx = this.state.leftOffset._value - this.leftOffsetAtPanStart) {
    const newLocation = this.getLocationAfterMove(dx)
    const newIndex = this.indexAtLeftOffset(newLocation)
    if (newIndex !== this.props.pageIndex && this.props.onPageChange) {
      this.props.onPageChange(newIndex)
    } else {
      this.animateLeftOffsetTo(this.leftOffsetAtIndex(newIndex))
    }
  }

  getLocationAfterMove(dx) {
    return _.clamp(this.leftOffsetAtPanStart + dx, this.getMinOffset(), this.getMaxOffset())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageIndex !== this.props.pageIndex) {
      this.animateLeftOffsetTo(this.leftOffsetAtIndex(nextProps.pageIndex))
    }
  }

  leftOffsetAtIndex(index, props = this.props) {
    const { itemWidth, containerWidth } = props
    return (containerWidth - itemWidth) / 2 - index * itemWidth
  }

  indexAtLeftOffset(leftOffset) {
    const { containerWidth, itemWidth } = this.props
    const scrollDistance = (containerWidth - itemWidth) / 2 - leftOffset
    return Math.round(scrollDistance / itemWidth)
  }

  getMaxOffset() {
    return (this.props.containerWidth - this.props.itemWidth) / 2
  }

  getMinOffset() {
    return this.getMaxOffset() - (this.props.children.length - 1) * this.props.itemWidth
  }

  animateLeftOffsetTo(destination) {
    this.busy = true
    animateTo(this.state.leftOffset,
      destination,
      200,
      undefined,
      () => this.busy = false
    )
  }

  render() {
    return (
      <View style={{ width: this.props.containerWidth, overflow: 'hidden', ...this.props.style }}>
        <Animated.View style={{ flexDirection: 'row', left: this.state.leftOffset }}
          {...this._panResponder.panHandlers} >
          { this.props.children }
        </Animated.View>
      </View>
    )
  }
}

export default Carousel
