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
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        this.leftOffsetAtPanStart = this.state.leftOffset._value
        this.setState({ leftOffset: new Animated.Value(this.state.leftOffset._value) })
        this.props.onTouchStart && this.props.onTouchStart()
      },

      onPanResponderMove: (evt, gestureState) => {
        const newLocation = _.clamp(this.leftOffsetAtPanStart + gestureState.dx, this.getMinOffset(), this.getMaxOffset())
        const oldIndex = this.indexAtLeftOffset(this.state.leftOffset._value)
        const newIndex = this.indexAtLeftOffset(newLocation)
        this.setState({
          leftOffset: new Animated.Value(newLocation)
        })
        if (newIndex !== oldIndex) {
          this.props.onPageChange && this.props.onPageChange(newIndex)
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx === 0 && this.props.onPress) {
          const pressLocation = evt.nativeEvent.pageX
          const pressIndex = Math.floor((pressLocation - this.state.leftOffset._value) / this.props.itemWidth)
          this.props.onPress(pressIndex)
        } else {
          this.animateToEndPosition()
        }
      },

      onPanResponderTerminate: () => {
        this.animateToEndPosition()
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageIndex !== this.props.pageIndex) {
      animateTo(this.state.leftOffset, this.leftOffsetAtIndex(nextProps.pageIndex), 200)
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

  animateToEndPosition() {
    animateTo(this.state.leftOffset, this.leftOffsetAtIndex(this.indexAtLeftOffset(this.state.leftOffset._value)), 200)
  }

  render() {
    return (
      <View style={ this.props.style }>
        <Animated.View style={{ flexDirection: 'row', left: this.state.leftOffset }}
          {...this._panResponder.panHandlers} >
          { this.props.children }
        </Animated.View>
      </View>
    )
  }
}

export default Carousel
