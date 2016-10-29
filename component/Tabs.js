import React from 'react'
import { View, TouchableHighlight, Modal, StyleSheet } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actions from '../store/reducer/navigation'
import modalState from '../store/reducer/modalState'
import { openLoginForm } from '../store/reducer/login'
import TabBar from './tabbar/TabBar'
import SearchTab from './searchTab/SearchTab'
import NetworkConnection from './NetworkConnection'
import TransactionList from './spending/TransactionList'
import Account from './Account'
import LoginToView, { emptyStateImage } from './loggedOutState/LoginToView'
import Login from './Login'
import LoginStatus from './LoginStatus'
import TraderScreen from './TraderScreen'
import PersonScreen from './PersonScreen'
import DeveloperOptions from './DeveloperOptions'
import color from '../util/colors'
import merge from '../util/merge'
import LOGIN_STATUSES from '../stringConstants/loginStatus'

const style = {
  tabs: {
    flex: 1,
    backgroundColor: color.white
  },
  hiddenTabBar: {
    height: 0
  },
  flex: {
    flex: 1
  },
  login: {
    opacity: 0.7,
    transform: [
      {scale: 0.9}
    ]
  },
  loginOverlay: {
    visible: {
      ...StyleSheet.absoluteFillObject,
    },
    hidden: {
      position: 'absolute',
      height: 0
    }
  }
}

const componentForModalState = (state) => {
  switch (state) {
    case modalState.traderScreen:
      return <TraderScreen/>
    case modalState.personScreen:
      return <PersonScreen/>
    case modalState.developerOptions:
      return <DeveloperOptions/>
  }
}

const WithNetworkConnection = (props) =>
  <View style={style.flex}>
    {props.children}
    <NetworkConnection/>
  </View>


const Tabs = (props) =>
  <View style={style.flex}>
    <ScrollableTabView
        // On Android devices, when the keyboard is visible it pushes the entire
        // view upwards. In this instance we want to hide the tab bar
        renderTabBar={() => props.dialogOpen ? <View style={style.hiddenTabBar}/> : <TabBar/>}
        tabBarPosition='bottom'
        initialPage={props.navigation.tabIndex}
        tabBarActiveTextColor={color.bristolBlue}
        style={merge(style.tabs, props.dialogOpen ? style.login : {})}
        tabBarBackgroundColor={color.lightGray}
        scrollWithoutAnimation={true}
        locked={true}
        onChangeTab={({i}) => props.navigateToTab(i)}
        tabBarUnderlineColor={color.transparent}>
      <WithNetworkConnection tabLabel='Search'>
        <SearchTab/>
      </WithNetworkConnection>
      <WithNetworkConnection tabLabel='Spending'>
        { props.loggedIn
          ? <TransactionList/>
          : <LoginToView
              image={emptyStateImage.spending}
              lineOne='Login to view'
              lineTwo='your spending history'/> }
      </WithNetworkConnection>
      <WithNetworkConnection tabLabel='Account'>
        { props.loggedIn
          ? <Account/>
          : <LoginToView
              image={emptyStateImage.account}
              lineOne='Login to view'
              lineTwo='your account details'/> }
      </WithNetworkConnection>
    </ScrollableTabView>
    <Modal
      animationType={'slide'}
      transparent={false}
      onRequestClose={() => props.showModal(modalState.none)}
      visible={props.modalState !== modalState.none}>
      {componentForModalState(props.modalState)}
    </Modal>
    <TouchableHighlight
      style={props.dialogOpen ? style.loginOverlay.visible : style.loginOverlay.hidden}
      onPress={() => props.openLoginForm(false)}
      underlayColor={color.transparent}>
      <View/>
    </TouchableHighlight>
    { props.dialogOpen ? <Login /> : undefined }
    <LoginStatus/>
  </View>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, openLoginForm }, dispatch)

const mapStateToProps = (state) => ({
  navigation: state.navigation,
  modalState: state.navigation.modalState,
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN,
  status: state.status,
  dialogOpen: state.login.loginFormOpen,
  online: state.networkConnection.status
})

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
