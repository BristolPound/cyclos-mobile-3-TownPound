import React from 'react'
import { View, TextInput, } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import * as actions from '../../store/reducer/business'
import { TRADER_LIST_ROW_HEIGHT, DOCKED_LIST_VISIBLE_ROWS } from './constants'
import styles from './SearchTabStyle'

const computeListHeight = (dataSource) =>
  Math.min(DOCKED_LIST_VISIBLE_ROWS, dataSource.getRowCount()) * TRADER_LIST_ROW_HEIGHT

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
        <View style={styles.searchTab.searchBar}>
          <TextInput
              ref={(ref) => this.searchBarRef = ref}
              style={{ flex: 7}}
              onFocus={() => this.props.enableSearchMode(true)}
              onBlur={() => this.props.enableSearchMode(false)}/>
        </View>
        <BusinessList
            compactHeight={computeListHeight(this.props.business.dataSource)}
            expandOnScroll={this.props.business.dataSource.getRowCount() > DOCKED_LIST_VISIBLE_ROWS}
            style={styles.searchTab.list}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({business: state.business})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
