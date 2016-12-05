import React from 'react'
import { View } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import { modalState } from '../store/reducer/navigation'
import { openLoginForm } from '../store/reducer/login'
import TabBar from './tabbar/TabBar'
import SearchTab from './searchTab/SearchTab'
import NetworkConnection from './NetworkConnection'
import SpendingTab from './spending/SpendingTab'
import Account from './Account'
import LoginToView, { emptyStateImage } from './loggedOutState/LoginToView'
import Login from './login/Login'
import LoginOverlay from './login/LoginOverlay'
import StatusMessage from './StatusMessage'
import TraderScreen from './TraderScreen'
import PersonScreen from './PersonScreen'
import DeveloperOptions from './DeveloperOptions'
import color from '../util/colors'
import merge from '../util/merge'
import { LOGIN_STATUSES } from '../store/reducer/login'
import Modal from './Modal'

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
          ? <SpendingTab/>
          : <LoginToView
              image={emptyStateImage.spending}
              lineOne='Log in to view'
              lineTwo='your spending history'/> }
      </WithNetworkConnection>
      <WithNetworkConnection tabLabel='Account'>
        { props.loggedIn
          ? <Account/>
          : <LoginToView
              image={emptyStateImage.account}
              lineOne='Log in to view'
              lineTwo='your account details'/> }
      </WithNetworkConnection>
    </ScrollableTabView>
    <Modal visible={props.modalVisible}>
      {componentForModalState(props.modalState)}
    </Modal>
    <LoginOverlay/>
    <Login/>
    <StatusMessage/>
  </View>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, openLoginForm }, dispatch)

const mapStateToProps = (state) => ({
  navigation: state.navigation,
  modalState: state.navigation.modalState,
  modalVisible: state.navigation.modalVisible,
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN,
  status: state.status,
  dialogOpen: state.login.loginFormOpen,
  online: state.networkConnection.status
})

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
