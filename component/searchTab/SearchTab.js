import React from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import ScrollingExpandPanel from './ScrollingExpandPanel'
import styles, {SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN_TOP_IOS, SEARCH_BAR_MARGIN, MAP_HEIGHT} from './SearchTabStyle'
import {ROW_HEIGHT} from './BusinessListStyle'
import {TAB_BAR_HEIGHT} from '../tabbar/TabBar'
import { openTraderModal } from '../../store/reducer/navigation'
import { expandBusinessList } from '../../store/reducer/business'

// The following height calculations refer to the list
const BUSINESS_LIST_TOP_OFFSET = SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN

const maxExpandedHeight = Dimensions.get('window').height - SEARCH_BAR_MARGIN_TOP_IOS - SEARCH_BAR_HEIGHT - TAB_BAR_HEIGHT

const maxCollapsedHeight = maxExpandedHeight - MAP_HEIGHT

const calculateExpandedHeight = (rowCount) => Math.min(rowCount * ROW_HEIGHT + 10, maxExpandedHeight)
const calculateCollapsedHeight = (rowCount) => Math.min(rowCount * ROW_HEIGHT + 10, maxCollapsedHeight)

const SearchTab = (props) => {
  const collapsedHeight = calculateCollapsedHeight(props.businessesToDisplay.length)
  const expandedHeight = calculateExpandedHeight(props.businessesToDisplay.length)
  return (
    <View style={{flex: 1}}>
      <BackgroundMap/>
      <View style={styles.searchTab.searchBar}>
        <View style={styles.searchTab.dropshadow}/>
      </View>
      <ScrollingExpandPanel
          style={styles.searchTab.list}
          topOffsetWhenExpanded={BUSINESS_LIST_TOP_OFFSET + maxExpandedHeight - expandedHeight}
          topOffsetWhenCollapsed={BUSINESS_LIST_TOP_OFFSET + maxExpandedHeight - collapsedHeight}
          expandedHeight={expandedHeight}
          rowHeight={ROW_HEIGHT}
          onPressItem={(index) => props.businessesToDisplay[index] && props.openTraderModal(props.businessesToDisplay[index].id)}
          childrenHeight={props.businessesToDisplay.length * ROW_HEIGHT}>
        <BusinessList businessesToDisplay={props.businessesToDisplay}/>
      </ScrollingExpandPanel>
    </View>
  )
}

const mapStateToProps = (state) => ({
  businessesToDisplay: state.business.businessesToDisplay,
  businessListExpanded: state.business.businessListExpanded
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ openTraderModal, expandBusinessList }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
