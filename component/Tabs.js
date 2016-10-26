import React from 'react'
import { View, TouchableHighlight, Modal } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actions from '../store/reducer/navigation'
import modalState from '../store/reducer/modalState'
import { closeLoginForm } from '../store/reducer/login'
import TabBar from './tabbar/TabBar'
import SearchTab from './searchTab/SearchTab'
import NetworkConnection from './NetworkConnection'
import TransactionList from './spending/TransactionList'
import Account from './Account'
import LoginToView, { emptyStateImage } from './loggedOutState/LoginToView'
import Login from './Login'
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
  flex: {
    flex: 1
  },
  backgroundView: {
    margin: 20,
    opacity: 0.5
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

const Tabs = (props) => {
  const content =
    <View style={merge(style.flex, props.dialogOpen ? { margin: 20 } : {})}>
      <ScrollableTabView
          renderTabBar={() => props.dialogOpen ? <View style={{ height: 0 }}/> : <TabBar/>}
          tabBarPosition='bottom'
          initialPage={props.navigation.tabIndex}
          tabBarActiveTextColor={color.bristolBlue}
          style={style.tabs}
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
    </View>

  return (
    <View style={style.tabs}>
      {props.dialogOpen
      ? <View style={style.flex}>
          <TouchableHighlight
              style={merge(style.flex, style.backgroundView)}
              onPress={() => props.closeLoginForm()}
              underlayColor={color.transparent}>
            {content}
          </TouchableHighlight>
          <Login />
        </View>
      : content}
    </View> )
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, closeLoginForm }, dispatch)

const mapStateToProps = (state) => ({
  navigation: state.navigation,
  modalState: state.navigation.modalState,
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN,
  status: state.status,
  dialogOpen: state.login.loginFormOpen,
  online: state.networkConnection.status
})

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
