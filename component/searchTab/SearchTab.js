import React from 'react'
import { View, TextInput, TouchableHighlight, Text, Platform } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import * as actions from '../../store/reducer/business'
import styles from './SearchTabStyle'

const DOCKED_LIST_VISIBLE_ROWS = 3

// For Android devices, the scroll-to-expand behaviour is problematic. So instead
// we fall back to a simpler interaction model.
const EXPANDABLE_LIST = Platform.OS === 'ios'

const computeListHeight = (dataSource) =>
  Math.min(DOCKED_LIST_VISIBLE_ROWS, dataSource.getRowCount()) * styles.listItem.container.height +
  (EXPANDABLE_LIST ? 0 : styles.expandHeader.container.height)

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
            <TouchableHighlight
                style={{ flex: 1 }}
                onPress={this.closeButtonPressed.bind(this)}>
              <Text>X</Text>
            </TouchableHighlight>
        </View>
        <BusinessList
            compactHeight={computeListHeight(this.props.business.dataSource)}
            expandable={this.props.business.dataSource.getRowCount() > DOCKED_LIST_VISIBLE_ROWS}
            expandOnScroll={EXPANDABLE_LIST}
            style={styles.searchTab.list}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({business: state.business})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
