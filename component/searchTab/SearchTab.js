import React from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import * as actions from '../../store/reducer/business'
import styles, {ROW_HEIGHT} from './SearchTabStyle'
import PLATFORM from '../../util/Platforms'

// For Android devices, the scroll-to-expand behaviour is problematic. So instead
// we fall back to a simpler interaction model.
const EXPAND_VIA_SCROLL = PLATFORM.isIOS()

// 403 = 35 + 48 + 275 + 45 (sum of borders, margins, other component heights etc.)
// and optionally the expand header
const COLLAPSED_LIST_HEIGHT =
  Dimensions.get('window').height - 403 - (EXPAND_VIA_SCROLL * styles.expandHeader.container.height)

// This is the maximum number of rows that would be visible when the list is collapsed
// 10 is the transparent space for the selected trader
const MAX_VISIBLE_ROWS = Math.floor((COLLAPSED_LIST_HEIGHT-10)/ROW_HEIGHT)

class SearchTab extends React.Component {
  constructor() {
    super()
    this.searchBarRef = undefined
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundMap/>
        <BusinessList
            compactHeight={COLLAPSED_LIST_HEIGHT}
            expandable={EXPAND_VIA_SCROLL &&
              (this.props.business.dataSource.getRowCount() > MAX_VISIBLE_ROWS)}
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
