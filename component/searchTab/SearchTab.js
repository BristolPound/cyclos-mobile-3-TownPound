import React from 'react'
import { View, Platform } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import * as actions from '../../store/reducer/business'
import styles from './SearchTabStyle'
import PLATFORM from '../../stringConstants/platform'

const DOCKED_LIST_VISIBLE_ROWS = 3

// For Android devices, the scroll-to-expand behaviour is problematic. So instead
// we fall back to a simpler interaction model.
const EXPAND_VIA_SCROLL = Platform.OS === PLATFORM.IOS

const computeListHeight = (dataSource) =>
  // the compact list shows up to 3 rows
  Math.min(DOCKED_LIST_VISIBLE_ROWS, dataSource.getRowCount()) * styles.listItem.container.height +
  // and optionally the exapnd header
  (!EXPAND_VIA_SCROLL && dataSource.getRowCount() > DOCKED_LIST_VISIBLE_ROWS
    ? styles.expandHeader.container.height
    : 0)

class SearchTab extends React.Component {
  constructor() {
    super()
    this.searchBarRef = undefined
  }
  closeButtonPressed() {
    this.searchBarRef.blur()
    this.props.enableSearchMode(false)
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundMap/>
        <BusinessList
            compactHeight={computeListHeight(this.props.business.dataSource)}
            expandable={this.props.business.dataSource.getRowCount() > DOCKED_LIST_VISIBLE_ROWS}
            expandOnScroll={EXPAND_VIA_SCROLL}
            style={styles.searchTab.list}/>
        <View style={styles.searchTab.searchBar}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({business: state.business})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
