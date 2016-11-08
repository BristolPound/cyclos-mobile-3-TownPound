import React from 'react'
import { Animated, Easing, View } from 'react-native'
import _ from 'lodash'

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

// distance moved before a tap becomes a drag
const MAX_TAP_DRAG = 1

// for visual feedback on pressable stuff
const highlightStyle = {
  position: 'absolute',
  backgroundColor: 'lightsteelblue',
  opacity: 0.3,
  flex: 1,
  left: 0,
  right: 0
}

class ScrollingExpandPanel extends React.Component {
  constructor(props) {
    super()

    this.resetVariablesToStationary()

    const startExpanded = typeof(props.initialState) === 'string'
      && props.initialState.toLowerCase() === 'expanded'

    const initialTopOffset = startExpanded
      ? props.topOffsetWhenExpanded
      : props.topOffsetWhenCollapsed

    this.state = ({
      // The distance between the top of this component and the top of the parent/screen,
      // as shown to the user at any point in time. Think of this as the 'master position'.
      // By default, start collapsed
      currentOuterTopOffset: new Animated.Value(initialTopOffset),

      // The distance between the top of the children and the top of this component.
      // Note that the scrolling behaviour means this will always be zero or negative.
      // The value of currentInnerTopOffset is simply -1 times the 'scroll distance' of the
      // inner `View` relative to the outer `View` of this component.
      currentInnerTopOffset: new Animated.Value(0),

      // Highlights are for visual feedback when tapping an item
      showHighlight: false
    })
  }

  resetVariablesToStationary() {
    // initial and current y-coordinates of gesture
    this.startTouchY = undefined
    this.lastTouchY = undefined

    // `currentInnerTopOffset` at touch start.
    // Equals -1 * (scroll position at touch start)
    this.innerTopOffsetAtTouchStart = undefined

    // `currentOuterTopOffset` at touch start
    this.outerTopOffsetAtTouchStart = undefined

    // timestamp to see if a drag is actually a tap
    this.timeAtTouchStart = undefined

    // used to calculate velocity:
    this.timeAtLastPosition = undefined
    this.velocity = 0 // in dp/ms

    // whether or not the list was expanded when the gesture began
    this.expandedAtTouchStart = undefined

    //whether or not an 'event' is taking place
    this.responderGranted = false
  }

  calculateMaxScrollDistance(props) {
    return props.childrenHeight - props.expandedHeight
  }

  // utility for animations. 'easing' and 'callback' are optional
  animateTo(parameterToAnimate, value, duration, easing, callback) {
    Animated.timing(parameterToAnimate, {
      toValue: value,
      easing: easing || Easing.out(Easing.ease),
      duration
    }).start(callback)
  }

  // apply smooth transition when list size changes
  componentWillReceiveProps(nextProps) {
    const targetLocation = this.isExpanded() ? nextProps.topOffsetWhenExpanded : nextProps.topOffsetWhenCollapsed
    this.animateTo(this.state.currentOuterTopOffset, targetLocation, 200)
  }

  isExpanded() {
    return this.state.currentOuterTopOffset._value <
          (this.props.topOffsetWhenExpanded + this.props.topOffsetWhenCollapsed) / 2
  }

  responderGrant(event) {
    this.startTouchY = this.lastTouchY = event.nativeEvent.pageY
    this.outerTopOffsetAtTouchStart = this.state.currentOuterTopOffset._value
    this.innerTopOffsetAtTouchStart = this.state.currentInnerTopOffset._value
    this.timeAtLastPosition = this.timeAtTouchStart = Date.now()

    this.expandedAtTouchStart = this.isExpanded()

    // if there is an ongoing animation, stop it
    this.setState({
      currentOuterTopOffset: new Animated.Value(this.state.currentOuterTopOffset._value),
      currentInnerTopOffset: new Animated.Value(this.state.currentInnerTopOffset._value),
      showHighlight: !!this.props.onPressItem
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
      this.props.topOffsetWhenExpanded,
      this.props.topOffsetWhenCollapsed
    )
  }

  getCurrentScroll(currentTouchY) {
    const unboundedScrollPosition = this.props.topOffsetWhenExpanded - this.calculateCombinedOffsets(currentTouchY)
    return _.clamp(
      unboundedScrollPosition,
      0,
      this.props.childrenHeight - this.props.expandedHeight
    )
  }

  // utility to check whether the list is expanded at 'newPosition'
  isExpandedAfterMove(newPosition) {
    if (this.expandedAtTouchStart) {
      return newPosition < (1 - DRAG_DISTANCE_TO_EXPAND) * this.props.topOffsetWhenExpanded
                    + DRAG_DISTANCE_TO_EXPAND * this.props.topOffsetWhenCollapsed
    }
    return newPosition < DRAG_DISTANCE_TO_EXPAND * this.props.topOffsetWhenExpanded +
                    (1 - DRAG_DISTANCE_TO_EXPAND) * this.props.topOffsetWhenCollapsed
  }

  // main update method
  updateComponentOnMove(event) {

    const currentTouchY = event.nativeEvent.pageY

    // speed of finger
    const touchVelocity = (currentTouchY - this.lastTouchY) / (Date.now() - this.timeAtLastPosition)

    // 'momentum' of component
    this.velocity = INERTIA * this.velocity + (1 - INERTIA) * touchVelocity

    this.timeAtLastPosition = Date.now()

    // if it is fully expanded, take this as the new starting state.
    // Important because the expand/collapse cut-off point is different depending on whether
    // one is dragging from an expanded or from a collapsed state
    if (this.currentOuterTopOffset === this.props.topOffsetWhenExpanded) {
      this.expandedAtTouchStart = true
    }

    const currentOuterTopOffset = this.getCurrentOuterTopOffset(currentTouchY)
    const currentInnerTopOffset = -1 * this.getCurrentScroll(currentTouchY)

    this.lastTouchY = currentTouchY

    this.setState({
      currentOuterTopOffset: new Animated.Value(currentOuterTopOffset),
      currentInnerTopOffset: new Animated.Value(currentInnerTopOffset),
      showHighlight: this.state.showHighlight && this.gestureResemblesPress(currentTouchY)
    })
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

  gestureResemblesPress(endTouchY) {
    return Math.abs(endTouchY - this.startTouchY) < MAX_TAP_DRAG
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
    if (this.isExpandedAfterMove(this.state.currentOuterTopOffset._value + remainder)) {
      this.animateTo(
        this.state.currentInnerTopOffset,
        finalInnerTopOffset_bounded,
        (finalInnerTopOffset_bounded - this.state.currentInnerTopOffset._value) / this.velocity
      )
    } else {
      // TODO: This is still an approximation to the correct easing! Perhaps it would be better
      // to allow currentInnerTopOffset to become positive here, then reset everything once the animation
      // is complete. That way we would not have to use 'piecewise' easing
      this.animateTo(
        this.state.currentInnerTopOffset,
        0,
        Math.abs(this.state.currentInnerTopOffset._value / this.velocity),
        Easing.linear,
        this.collapseWithAnimation.bind(this)
      )
    }
  }

  expandWithAnimation() {
    this.animateTo(
      this.state.currentOuterTopOffset,
      this.props.topOffsetWhenExpanded,
      this.state.currentOuterTopOffset._value - this.props.topOffsetWhenExpanded
    )
  }

  collapseWithAnimation() {
    this.animateTo(
      this.state.currentOuterTopOffset,
      this.props.topOffsetWhenCollapsed,
      this.props.topOffsetWhenCollapsed - this.state.currentOuterTopOffset._value
    )
  }

  getTargetItem() {
    if (this.props.rowHeight) {
      const pressLocation = this.startTouchY - this.innerTopOffsetAtTouchStart - this.outerTopOffsetAtTouchStart
      return Math.floor(pressLocation / this.props.rowHeight)
    }
  }

  responderRelease() {
    // Was this a press rather than a drag ?
    if (this.state.showHighlight) {

      this.props.onPressItem(this.getTargetItem())

      if (this.expandedAtTouchStart) {
        this.expandWithAnimation()
      } else {
        this.collapseWithAnimation()
      }

     // Do we wish to apply momentum? Depends whether the touch stopped moving
   } else if (this.velocity && Date.now() - this.timeAtLastPosition < 150) {

      // If scrolling, apply momentum to scroll
      if (this.state.currentInnerTopOffset._value) {
        this.handleScrollMomentumRelease()

      } else { // slide back to expanded or collapsed position
        const endPosition = this.state.currentOuterTopOffset._value + this.getMomentumTravel()
        if (this.isExpandedAfterMove(endPosition)) {
          this.expandWithAnimation()
        } else {
          this.collapseWithAnimation()
        }
      }
    }

    this.setState({showHighlight: false})

    // cleanup
    this.resetVariablesToStationary()
  }

  render() {
    const showHighlightIfAppropriate = () =>
      this.state.showHighlight
      ? <View style={{...highlightStyle,
              top: this.getTargetItem() * this.props.rowHeight,
              height: this.props.rowHeight || this.props.childrenHeight
            }}/>
      : undefined

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
          {showHighlightIfAppropriate()}
        </Animated.View>
      </Animated.View>
    )
  }
}

export default ScrollingExpandPanel
