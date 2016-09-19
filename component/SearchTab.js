import React from 'react'
import { View, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import * as actions from '../store/reducer/business'

const ROW_HEIGHT = 71
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
    backgroundColor: 'white'
  }
}

const SearchTab = (props) =>
  <View style={{flex: 1}}>
    <BackgroundMap/>
    <TextInput style={style.searchBar}
        onFocus={() => props.expandBusinessList(true)}
        onBlur={() => props.expandBusinessList(false)}/>
    <BusinessList
        compactHeight={ROW_HEIGHT * 3}
        style={style.businessList}/>
  </View>

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
