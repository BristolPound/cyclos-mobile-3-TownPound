import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { showModal, modalState, setMenuOpen, menuActions } from '../../store/reducer/navigation'
import { LOGIN_STATUSES } from '../../store/reducer/login'
import style from './TabBarStyle'
import Config from '@Config/config'
import Images from '@Assets/images'

// NOTE - The image URLs must be known statically
// see: https://facebook.github.io/react-native/docs/images.html

const TabItem = (active, inactive, label) => ({ active, inactive, label })
const TABS = [
    TabItem(
        Images.searchActive,
        Images.searchInactive,
        'Search Tab'
    ),
    TabItem(
        Images.spendingActive,
        Images.spendingInactive,
        'Spending Tab'
    ),
    TabItem(
        Images.meActive,
        Images.meInactive,
        'My Details Tab'
    ),
    TabItem(
        Images.spendingActive,
        Images.spendingInactive,
        'Quick Pay Tab'
    )
]

const isTabActive = (index, tabIndex, menuAction, menuOpen) => {
  return (tabIndex === index) && (menuAction === menuActions.none) && !menuOpen
}

const isDevMode = Config.FLAVOUR === 'dev'

const TabBar = (props) => 
  <View style={style.tabBar}>
    {TABS.map((tab, index) =>
      <View style={style.centerChildren} key={index}>
        <TouchableOpacity
            style={style.iconContainer}
            onPress={() => props.goToPage(index)}
            onLongPress={() => {isDevMode && props.showModal(modalState.developerOptions)}}
            accessibilityLabel={tab.label}>
          <Image source={isTabActive(index, props.tabIndex, props.menuAction, props.menuOpen) ? tab.active : tab.inactive}/>
        </TouchableOpacity>
        <View style={style.separator}/>
      </View>
    )}
    <View style={style.centerChildren} key={TABS.length}>
        <TouchableOpacity
            style={style.iconContainer}
            onPress={() => props.setMenuOpen()}
            accessibilityLabel='Menu'>
          <Image source={props.menuOpen ? Images.meActive : Images.meInactive}/>
        </TouchableOpacity>
      </View>
  </View>


const mapStateToProps = (state) => ({
  tabIndex: state.navigation.tabIndex,
  menuAction: state.navigation.menuAction,
  menuOpen: state.navigation.menuOpen
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    showModal,
    setMenuOpen
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TabBar)
