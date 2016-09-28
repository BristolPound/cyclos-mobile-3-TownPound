import React from 'react'
import { View, TextInput, TouchableHighlight, Text } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import * as actions from '../store/reducer/business'

const ROW_HEIGHT = 71
const VISIBLE_ROWS = 3
const SEARCH_BAR_HEIGHT = 50
const MARGIN_SIZE = 20

const style = {
  businessList: {
    position: 'absolute',
    top: MARGIN_SIZE + SEARCH_BAR_HEIGHT,
    left: MARGIN_SIZE,
    right: MARGIN_SIZE,
    bottom: MARGIN_SIZE
  },
  searchBar: {
    height: SEARCH_BAR_HEIGHT,
    margin: MARGIN_SIZE,
    backgroundColor: 'white',
    flexDirection: 'row'
  }
}

const computeListHeight = (dataSource) =>
  Math.min(VISIBLE_ROWS, dataSource.getRowCount()) * ROW_HEIGHT

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
        <View style={style.searchBar}>
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
            expandOnScroll={this.props.business.dataSource.getRowCount() > VISIBLE_ROWS}
            style={style.businessList}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({business: state.business})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
