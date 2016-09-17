import React from 'react'
import { ListView, Animated, Easing } from 'react-native'
import BusinessListItem from './BusinessListItem'
import merge from '../util/merge'
import { connect } from 'react-redux'

class BusinessList extends React.Component {

  constructor() {
    super()

    this.state = {
      top: new Animated.Value(0)
    }

    this.lastScrollY = 0
    this.ignoreNextScrollEvent = false
    this.isExpanded = false
    this.isMeasured = false
    this.topWhenCompact = 0
    this.topWhenExpanded = 0
  }

  onScroll(evt) {
    // remove duplicated scroll events
    if (evt.nativeEvent.contentOffset.y === this.lastScrollY)
      return
    this.lastScrollY = evt.nativeEvent.contentOffset.y

    // skip this scroll event
    if (this.ignoreNextScrollEvent) {
      this.ignoreNextScrollEvent = false
      return
    }

    const animateTopTo = value =>
      Animated.timing(this.state.top, {
        toValue: value,
        easing: Easing.out(Easing.quad)
      }).start()

    // if the user scrolls the list up when compact, expand
    if (!this.isExpanded && evt.nativeEvent.contentOffset.y > 0) {
      this.refs.listView.scrollTo({y:0, animated: false})
      this.ignoreNextScrollEvent = true
      animateTopTo(this.topWhenExpanded)
      this.isExpanded = true
    // if the user scrolls the list down, when expanded, make it compact
    } else if (this.isExpanded && evt.nativeEvent.contentOffset.y <= 0) {
      animateTopTo(this.topWhenCompact)
      this.isExpanded = false
    }
  }

  componentWillMount() {
    if (!this.props.style.position || this.props.style.position !== 'absolute') {
      throw new Error('The ExpandoList component must be absolute positioned')
    }
  }

  onLayout(event) {
    // measure the component on first render
    if (this.isMeasured) {
      return
    }
    this.isMeasured = true

    const height = event.nativeEvent.layout.height
    this.topWhenCompact = height - this.props.compactHeight
    this.topWhenExpanded = this.props.style.top
    // start in the compact state
    this.setState({
      top: new Animated.Value(this.topWhenCompact)
    })
  }

  render() {
    const top = this.props.searchMode ? this.topWhenExpanded : this.state.top
    return (
      <Animated.View
          onLayout={this.onLayout.bind(this)}
          style={merge(this.props.style, {top})}>
        <ListView
            ref='listView'
            pageSize={10}
            showsVerticalScrollIndicator={false}
            onScroll={this.onScroll.bind(this)}
            scrollEventThrottle={16}
            dataSource={this.props.dataSource}
            renderRow={(business) => <BusinessListItem business={business}/>}/>
      </Animated.View>
    )
  }
}

const mapStateToProps = (state) => ({...state.business})

export default connect(mapStateToProps)(BusinessList)
