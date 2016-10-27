import React from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import * as actions from '../../store/reducer/business'
import styles, {ROW_HEIGHT, SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN, MAP_HEIGHT} from './SearchTabStyle'
import {TAB_BAR_HEIGHT} from '../tabbar/TabBar'
import PLATFORM from '../../util/Platforms'

// For Android devices, the scroll-to-expand behaviour is problematic. So instead
// we fall back to a simpler interaction model.
const EXPAND_VIA_SCROLL = PLATFORM.isIOS()

// sum of borders, margins, other component heights etc.
// and optionally the expand header
const OTHER_COMPONENT_HEIGHTS_SUM = SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN + MAP_HEIGHT + TAB_BAR_HEIGHT  + (!EXPAND_VIA_SCROLL * styles.expandHeader.container.height)

const MAX_COLLAPSED_LIST_HEIGHT =
  Dimensions.get('window').height - OTHER_COMPONENT_HEIGHTS_SUM

// This is the maximum number of rows that would be visible when the list is collapsed
// 10 is the transparent space for the selected trader
const MAX_VISIBLE_ROWS = Math.floor((MAX_COLLAPSED_LIST_HEIGHT-10)/ROW_HEIGHT)

const calculateCollapsedListHeight = (rowCount) => Math.min(rowCount* ROW_HEIGHT + 10, MAX_COLLAPSED_LIST_HEIGHT)

class SearchTab extends React.Component {
  constructor() {
    super()
    this.searchBarRef = undefined
  }
  render() {
    const rowCount = this.props.business.dataSource ? this.props.business.dataSource.getRowCount() : 0
    return (
      <View style={{flex: 1}}>
        <BackgroundMap/>
        <BusinessList
            compactHeight={calculateCollapsedListHeight(rowCount)}
            expandable={EXPAND_VIA_SCROLL &&
              (rowCount > MAX_VISIBLE_ROWS)}
            expandOnScroll={EXPAND_VIA_SCROLL}
            style={styles.searchTab.list}/>
        <View style={styles.searchTab.searchBar}>
          <View style={styles.searchTab.dropshadow}/>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({business: state.business})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
