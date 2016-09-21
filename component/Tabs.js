import React from 'react'
import { View, StatusBar, Modal } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'

import TabBar from './tabbar/TabBar'
import SearchTab from './SearchTab'
import NetworkConnection from './NetworkConnection'
import TransactionsList from './TransactionsList'
import Account from './Account'
import Login from './Login'
import TraderScreen from './TraderScreen'
import DeveloperOptions from './DeveloperOptions'
import color from '../util/colors'

const style = {
  container: {
    backgroundColor: color.bristolBlue,
    flex: 1
  },
  tabs: {
    flex: 1,
    backgroundColor: 'white'
  },
  flex: {
    flex: 1
  }
}

const Tabs = (props) =>
  <View style={style.container}>
    <StatusBar barStyle='light-content'/>
    <ScrollableTabView
        renderTabBar={() => <TabBar/>}
        tabBarPosition='bottom'
        initialPage={props.navigation.tabIndex}
        tabBarActiveTextColor={color.bristolBlue}
        style={style.tabs}
        tabBarBackgroundColor={color.lightGray}
        scrollWithoutAnimation={true}
        locked={true}
        onChangeTab={({i}) => props.navigateToTab(i)}
        tabBarUnderlineColor={color.transparent}>
      <SearchTab tabLabel='Search'/>
      { props.loggedIn
        ? <TransactionsList tabLabel='Spending'/>
        : <Login tabLabel='Log in'/> }
      { props.loggedIn
        ? <Account tabLabel='Account' />
        : <DeveloperOptions tabLabel='Developer Options'/> }
    </ScrollableTabView>
    <NetworkConnection/>
    <Modal
      animationType={'slide'}
      transparent={false}
      onRequestClose={() => props.showTraderScreen(false)}
      visible={props.navigation.traderScreenVisible && !props.navigation.sendMoneyVisible}>
      <TraderScreen/>
    </Modal>
  </View>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({
  navigation: state.navigation,
  loggedIn: state.login.loggedIn,
  status: state.status
})

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
