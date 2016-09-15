import React from 'react'
import { View, TextInput } from 'react-native'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import Dimensions from 'Dimensions'
import { enableSearchMode } from '../store/reducer/navigation'
import { connect } from 'react-redux'

const TAB_BAR_HEIGHT = 50
const TOP_BAR_HEIGHT = 24
const SEARCH_BAR_HEIGHT = 50
const MARGIN_SIZE = 20

const usableHeight = Dimensions.get('window').height - TOP_BAR_HEIGHT

const listAreaHeight = usableHeight - SEARCH_BAR_HEIGHT - MARGIN_SIZE * 2 - TAB_BAR_HEIGHT

const style = {
  businessListDocked: {
    top: listAreaHeight / 2,
    marginLeft: MARGIN_SIZE,
    marginRight: MARGIN_SIZE,
    height: listAreaHeight / 2
  },
  businessListFullscreen: {
    marginLeft: MARGIN_SIZE,
    marginRight: MARGIN_SIZE,
    height: listAreaHeight
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
        onFocus={() => props.enableSearchMode(true)}
        onBlur={() => props.enableSearchMode(false)}/>
      <View style={props.searchMode ? style.businessListFullscreen : style.businessListDocked}>
      <BusinessList/>
    </View>
  </View>

const mapStateToProps = (state) => ({
  searchMode: state.navigation.searchMode
})

const mapDispatchToProps = (dispatch) => ({
  enableSearchMode: (enabled) => dispatch(enableSearchMode(enabled))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
