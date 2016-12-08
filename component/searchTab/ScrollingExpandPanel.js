import React from 'react'
import { Animated, Easing } from 'react-native'
import _ from 'lodash'
import animateTo from '../../util/animateTo'

// How far to drag it before it switches between expanded/collapsed states
const DRAG_DISTANCE_TO_EXPAND = 1/3

// Higher inertia makes the momentum respond less emphatically to quick 'flick' gestures.
// Must be betweem 0 and 1. When 0, momentum is determined solely by the speed of your finger as you release.
// At 1, there is no momentum at all.
// Between these values, momentum is calculated as a combination of the last value calculated and the current speed of the finge
// Maybe INERTIA should be 0, i.e. not exist. Feel free to remove
const INERTIA = 1/2

// FRICTION determines how long the momentum will continue
const FRICTION = 0.003

class ScrollingExpandPanel extends React.Component {
  constructor(props) {
    super()

    this.resetVariablesToStationary()

    this.state = ({
      // The distance between the top of this component and the top of the parent/screen,
      // as shown to the user at any point in time. Think of this as the 'master position'.
      // By default, start collapsed
      currentOuterTopOffset: new Animated.Value(props.topOffset[props.startPosition]),

      // The distance between the top of the children and the top of this component.
      // Note that the scrolling behaviour means this will always be zero or negative.
      // The value of currentInnerTopOffset is simply -1 times the 'scroll distance' of the
      // inner `View` relative to the outer `View` of this component.
      currentInnerTopOffset: new Animated.Value(0),
    })
  }

  resetVariablesToStationary() {
    // initial and current y-coordinates of gesture
    this.startTouchY = -1
    this.lastTouchY = -1

    // `currentInnerTopOffset` at touch start.
    // Equals -1 * (scroll position at touch start)
    this.innerTopOffsetAtTouchStart = -1

    // `currentOuterTopOffset` at touch start
    this.outerTopOffsetAtTouchStart = -1

    // timestamp to see if a drag is actually a tap
    this.timeAtTouchStart = -1

    // used to calculate velocity:
    this.timeAtLastPosition = -1
    this.velocity = 0 // in dp/ms

    // whether or not the list was expanded when the gesture began
    this.positionAtTouchStart = -1

    //whether or not an 'event' is taking place
    this.responderGranted = false

    //whether or not the gesture has moved
    this.hasMoved = false
  }

  calculateMaxScrollDistance(props) {
    return props.childrenHeight - props.expandedHeight
  }

  // apply smooth transition when list size changes
  componentWillReceiveProps(nextProps) {
    const targetLocation = nextProps.topOffset[this.getPosition()]
    animateTo(this.state.currentOuterTopOffset, targetLocation, 200)
  }

  getPosition() {
    for (let i = 0; i < this.props.topOffset.length - 1; i++) {
      if (this.state.currentOuterTopOffset._value < (this.props.topOffset[i] + this.props.topOffset[i+1]) / 2) {
        return i
  }
    }
    return this.props.topOffset.length - 1
  }

  responderGrant(event) {
    this.startTouchY = this.lastTouchY = event.nativeEvent.pageY
    this.outerTopOffsetAtTouchStart = this.state.currentOuterTopOffset._value
    this.innerTopOffsetAtTouchStart = this.state.currentInnerTopOffset._value
    this.timeAtLastPosition = this.timeAtTouchStart = Date.now()

    this.positionAtTouchStart = this.getPosition()

    this.props.onPressStart && this.props.onPressStart(this.startTouchY - this.innerTopOffsetAtTouchStart - this.outerTopOffsetAtTouchStart)

    // if there is an ongoing animation, stop it
    this.setState({
      currentOuterTopOffset: new Animated.Value(this.state.currentOuterTopOffset._value),
      currentInnerTopOffset: new Animated.Value(this.state.currentInnerTopOffset._value),
    })

    this.responderGranted = true
  }

  // utility for helping to find position and scrollposition
  calculateCombinedOffsets(currentTouchY) {
    return this.outerTopOffsetAtTouchStart
          + this.innerTopOffsetAtTouchStart
          + currentTouchY - this.startTouchY
  }

  getCurrentOuterTopOffset(currentTouchY) {
    return _.clamp(
      this.calculateCombinedOffsets(currentTouchY),
      this.props.topOffset[0],
      this.props.topOffset[this.props.topOffset.length - 1]
    )
  }

  getCurrentScroll(currentTouchY) {
    const unboundedScrollPosition = this.props.topOffset[0] - this.calculateCombinedOffsets(currentTouchY)
    return _.clamp(
      unboundedScrollPosition,
      0,
      this.props.childrenHeight - this.props.expandedHeight
    )
  }

  // utility to check whether the list is expanded at 'newPosition'
  positionAfterMove(nextYCoord) {
    const isMovingUpwards = (toPosition) => toPosition < this.positionAtTouchStart
    const { topOffset } = this.props
    const fractionBetweenPoints = (ratio, upperIndex) => ratio * topOffset[upperIndex] + (1 - ratio) * topOffset[upperIndex + 1]
    for (let i = 0; i < this.props.topOffset.length - 1; i++) {
      if ((isMovingUpwards(i) && nextYCoord < fractionBetweenPoints(DRAG_DISTANCE_TO_EXPAND, i))
          || (!isMovingUpwards(i) && nextYCoord < fractionBetweenPoints(1 - DRAG_DISTANCE_TO_EXPAND, i))) {
        return i
    }
  }
    return this.props.topOffset.length - 1
  }

  // main update method
  updateComponentOnMove(event) {
    const currentTouchY = event.nativeEvent.pageY

    if (Math.abs(currentTouchY - this.startTouchY) > 2) {
      this.hasMoved = true
    }

    if (this.hasMoved) {
      // speed of finger
      const touchVelocity = (currentTouchY - this.lastTouchY) / (Date.now() - this.timeAtLastPosition)

      // 'momentum' of component
      this.velocity = INERTIA * this.velocity + (1 - INERTIA) * touchVelocity

      this.timeAtLastPosition = Date.now()

      // if it is fully expanded, take this as the new starting state.
      // Important because the expand/collapse cut-off point is different depending on whether
      // one is dragging from an expanded or from a collapsed state
      for (let i = 0; i < this.props.topOffset.length; i++) {
        const offset = this.props.topOffset[i]
        if (this.state.currentOuterTopOffset._value <= offset && this.positionAtTouchStart > i
          || this.state.currentOuterTopOffset._value >= offset && this.positionAtTouchStart < i) {
            this.positionAtTouchStart = i
      }
      }

      const currentOuterTopOffset = this.getCurrentOuterTopOffset(currentTouchY)
      const currentInnerTopOffset = -1 * this.getCurrentScroll(currentTouchY)

      this.lastTouchY = currentTouchY

      this.setState({
        currentOuterTopOffset: new Animated.Value(currentOuterTopOffset),
        currentInnerTopOffset: new Animated.Value(currentInnerTopOffset),
      })
    }
  }

  responderMove(event) {
    // first check that responderGrant has already been called - if something in the
    // list has touch responders on it then this may not have occurred.
    if (this.responderGranted) {
      // A kind of 'throttle'
      if (Date.now() - this.timeAtLastPosition >= 16) {
        this.updateComponentOnMove(event)
      }
    } else {
      this.responderGrant(event)
    }
  }

  getDecelerationTime() {
    return Math.abs(this.velocity) / FRICTION
  }

  getMomentumTravel() {
    return this.velocity * this.getDecelerationTime() / 2
  }

  // Handle momentum for scrolling.
  handleScrollMomentumRelease() {
    const finalInnerTopOffset_unbounded = this.state.currentInnerTopOffset._value + this.getMomentumTravel()
    const finalInnerTopOffset_bounded = _.clamp(finalInnerTopOffset_unbounded, -1 * this.calculateMaxScrollDistance(this.props), 0)
    const remainder = finalInnerTopOffset_unbounded - finalInnerTopOffset_bounded
    const newPosition = this.positionAfterMove(this.state.currentOuterTopOffset._value + remainder)
    if (!newPosition) {
      animateTo(
        this.state.currentInnerTopOffset,
        finalInnerTopOffset_bounded,
        (finalInnerTopOffset_bounded - this.state.currentInnerTopOffset._value) / this.velocity
      )
    } else {
      // TODO: This is still an approximation to the correct easing! Perhaps it would be better
      // to allow currentInnerTopOffset to become positive here, then reset everything once the animation
      // is complete. That way we would not have to use 'piecewise' easing
      animateTo(
        this.state.currentInnerTopOffset,
        0,
        Math.abs(this.state.currentInnerTopOffset._value / this.velocity),
        Easing.linear,
        () => this.animatePositionTo(1)
      )
    }
  }

  animatePositionTo(index) {
    animateTo(
      this.state.currentOuterTopOffset,
      this.props.topOffset[index],
      Math.abs(this.state.currentOuterTopOffset._value - this.props.topOffset[index])
    )
  }

  responderRelease() {
    this.props.onPressRelease && this.props.onPressRelease(this.hasMoved)

    if (Date.now() - this.timeAtLastPosition > 150) {
      this.velocity = 0
    }

    // If scrolling, apply momentum to scroll
    if (this.state.currentInnerTopOffset._value) {
      this.handleScrollMomentumRelease()

    } else { // slide back to expanded or collapsed position
      const endPosition = this.state.currentOuterTopOffset._value + this.getMomentumTravel()
      this.animatePositionTo(this.positionAfterMove(endPosition))
      }

    // cleanup
    this.resetVariablesToStationary()
  }

  render() {
    return (
      <Animated.View style={{
            top: this.state.currentOuterTopOffset,
            overflow: 'hidden',
            ...this.props.style
          }}
          onStartShouldSetResponder={() => true}
          onResponderGrant={this.responderGrant.bind(this)}
          onMoveShouldSetResponder={() => true}
          onResponderMove={this.responderMove.bind(this)}
          onResponderRelease={this.responderRelease.bind(this)}>
        <Animated.View style={{ top: this.state.currentInnerTopOffset }}>
          {this.props.children}
        </Animated.View>
      </Animated.View>
    )
  }
}

export default ScrollingExpandPanel
