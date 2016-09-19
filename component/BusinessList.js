import React from 'react'
import { ListView, Animated, Easing } from 'react-native'
import BusinessListItem from './BusinessListItem'
import { bindActionCreators } from 'redux'
import merge from '../util/merge'
import { connect } from 'react-redux'
import * as actions from '../store/reducer/business'

class BusinessList extends React.Component {

  constructor() {
    super()

    this.state = {
      top: new Animated.Value(0)
    }

    this.lastScrollY = 0
    this.isExpanded = false
    this.isMeasured = false
    this.topWhenCompact = 0
    this.topWhenExpanded = 0
  }

  animateTopTo(value, callback) {
    Animated.timing(this.state.top, {
      toValue: value,
      easing: Easing.out(Easing.quad),
      duration: 300
    }).start(callback)
  }

  onScroll(evt) {
    // remove duplicated scroll events
    if (evt.nativeEvent.contentOffset.y === this.lastScrollY)
      return
    this.lastScrollY = evt.nativeEvent.contentOffset.y

    // if the user scrolls the list up when compact, expand
    if (!this.isExpanded && evt.nativeEvent.contentOffset.y > 0) {
      // in order to maintain smooth scrolling, defer the action which changes app state
      this.animateTopTo(this.topWhenExpanded, () => this.props.expandBusinessList(true))
      this.isExpanded = true

    // if the user scrolls the list down, when expanded, make it compact
    } else if (this.isExpanded && evt.nativeEvent.contentOffset.y <= 0) {
      // in order to maintain smooth scrolling, defer the action which changes app state
      this.animateTopTo(this.topWhenCompact, () => this.props.expandBusinessList(false))
      this.isExpanded = false
    }
  }

  componentWillMount() {
    if (!this.props.style.position || this.props.style.position !== 'absolute') {
      throw new Error('The ExpandoList component must be absolute positioned')
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.business.businessListExpanded === this.props.business.businessListExpanded) {
      return
    }
    // when the businessListExpanded state property changes, animate the state change
    this.animateTopTo(nextProps.business.businessListExpanded ? this.topWhenExpanded : this.topWhenCompact)
  }

  onLayout(event) {
    // measure the component on first render
    if (this.isMeasured) {
      return
    }
    this.isMeasured = true

    // determine the 'top' property value for expanded and compact state
    const height = event.nativeEvent.layout.height
    this.topWhenCompact = height - this.props.compactHeight
    this.topWhenExpanded = this.props.style.top

    // start in the compact state
    this.setState({
      top: new Animated.Value(this.topWhenCompact)
    })
  }

  render() {
    return (
      <Animated.View
          onLayout={this.onLayout.bind(this)}
          style={merge(this.props.style, {top: this.state.top})}>
        <ListView
            ref='listView'
            pageSize={10}
            showsVerticalScrollIndicator={false}
            onScroll={this.onScroll.bind(this)}
            scrollEventThrottle={16}
            dataSource={this.props.business.dataSource}
            renderRow={(business) => <BusinessListItem business={business}/>}/>
      </Animated.View>
    )
  }
}

const mapStateToProps = (state) => ({business: state.business})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BusinessList)
