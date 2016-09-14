import React from 'react'
import { View, StatusBar, Modal } from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'

import Price from './Price'
import SearchTab from './SearchTab'
import NetworkConnection from './NetworkConnection'
import TransactionsList from './TransactionsList'
import Login from './Login'
import BusinessDetails from './BusinessDetails'

import color from '../util/colors'
import merge from '../util/merge'

const style = {
  container: {
    backgroundColor: color.bristolBlue,
    flex: 1
  },
  tabs: {
    flex: 1,
    backgroundColor: 'white'
  },
  flexRow: {
    flexDirection: 'row'
  },
  flex: {
    flex: 1
  }
}

const TabBar = ({...props}) =>
  <View style={style.flexRow}>
    <DefaultTabBar {...props} style={merge(style.flex, { backgroundColor: 'white', borderColor: color.lightGray, borderTopWidth: 4})}/>
    {props.balance
      ? <View style={{flex: 0.5, backgroundColor: color.lightGray}}>
          <Price prefix={'�'} price={props.balance} color={color.bristolBlue} size={35} />
        </View>
      : undefined}
  </View>

const Tabs = (props) =>
  <View style={style.container}>
    <StatusBar barStyle='light-content'/>
    <ScrollableTabView
        renderTabBar={() => <TabBar balance={props.balance}/>}
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
        ? <TransactionsList tabLabel='Transactions'/>
        : <Login tabLabel='Transactions'/> }
    </ScrollableTabView>
    <NetworkConnection/>
    <Modal
      animationType={'slide'}
      transparent={false}
      onRequestClose={() => props.showBusinessDetails(false)}
      visible={props.navigation.businessDetailsVisible && !props.navigation.sendMoneyVisible}>
      <BusinessDetails/>
    </Modal>
  </View>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({
  navigation: state.navigation,
  loggedIn: state.login.loggedIn,
  status: state.status,
  balance: state.account.balance
})

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
