import React from 'react'
import Tabs from './Tabs'
import { View, StatusBar, AppState } from 'react-native'
import ReturningLogin from './login/ReturningLogin'
import Onboarding from './login/Onboarding'
import { mainComponent } from '../store/reducer/navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Login from './login/Login'
import LoginOverlay from './login/LoginOverlay'
import StatusMessage from './StatusMessage'
import Colors from '@Colors/colors'
import Config from '@Config/config'
import SendMoney from './sendMoney/SendMoney'
import AppCover from './lockedState/AppCover'
import md5 from 'md5'
import { logout } from '../store/reducer/login'
import { closeConfirmation, setCoverApp, navigateToTab, hideModal, setOverlayOpen } from '../store/reducer/navigation'
import { updatePage, resetPayment, resetForm } from '../store/reducer/sendMoney'
import UnlockAppAlert, {maxAttempts} from './lockedState/UnlockAppAlert'

class Root extends React.Component {

  constructor () {
    super()
    this.state = {
      appState: AppState.currentState,
      unlockError: false,
      failedAttempts: 0
    }
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/) && this.state.appState === 'active') {
      this.props.setCoverApp(true)
      this.setState({ appState: nextAppState})
    } else if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (this.props.passToUnlock!=='') {
        this.setState({askToUnlock: true, appState: nextAppState})
      } else {
        this.props.setCoverApp(false)
        this.setState({appState: nextAppState})
      }
    } else {
      this.setState({appState: nextAppState})
    }
  }

  checkPass (pass) {
    var encodedPass = md5(pass)
    if (encodedPass === this.props.passToUnlock) {
      this.props.setCoverApp(false)
      this.setState({askToUnlock: false, unlockError: false, failedAttempts: 0})
    } else {
      var failedAttempts = this.state.failedAttempts + 1
      if(failedAttempts < maxAttempts) {
        this.setState({unlockError: true, failedAttempts})
      } else {
        this.props.resetPayment()
        this.logout()
      }
    }
  }

  logout () {
    this.props.logout()
    this.props.closeConfirmation()
    this.setState({askToUnlock: false, unlockError: false, failedAttempts: 0})
    this.props.setCoverApp(false)
  }

  logoutPress () {
    this.props.navigateToTab(0)
    this.props.resetForm()
    this.props.setOverlayOpen(false)
    this.props.hideModal()
    this.logout()
  }

  render () {
      // The app is rendered before the state has been loaded via redux-persist. This state property allows
      // the main 'app' UI to be hidden until initialised.
      if (!this.props.stateInitialised) {
        return (
          <View style={{flex: 1}}/>
        )
      }
      let bodyComponent
      if (this.props.mainComponent === mainComponent.returningLogin) {
        bodyComponent = <ReturningLogin />
      } else if (this.props.mainComponent === mainComponent.onboarding) {
        bodyComponent = <Onboarding />
      } else if (this.props.mainComponent === mainComponent.tabs) {
        bodyComponent = <Tabs />
      } else {
        throw new Error('Invalid navigation state')
      }

      return (
        <View style={{flex: 1}}>
          <StatusBar animated={true}
              backgroundColor={Colors.transparent}
              translucent={true}
              barStyle={this.props.mainComponent === mainComponent.returningLogin ? 'light-content' : 'dark-content'}/>
          {bodyComponent}
          <LoginOverlay/>
          {(this.props.modalOpen && !this.props.loginFormOpen) && Config.ALLOW_LOGIN && (this.props.userShortDisplay !== this.props.payeeShortDisplay) ? <SendMoney /> : undefined}
          <Login/>
          <StatusMessage/>
          {this.props.coverApp
              && <AppCover unlockOpened={this.props.passToUnlock!=='' && this.state.askToUnlock}/> }
          {(this.props.passToUnlock !== '' || this.props.storePassword) && this.state.askToUnlock
              &&  <UnlockAppAlert
                    checkPass={(pass) => this.checkPass(pass)}
                    error={this.state.unlockError}
                    failedAttempts={this.state.failedAttempts}
                    logout={() => this.logoutPress()}
                  />
          }
        </View>
      )
  }

}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    logout,
    hideModal,
    closeConfirmation,
    updatePage,
    resetPayment,
    setCoverApp,
    navigateToTab,
    setOverlayOpen,
    resetForm
  }, dispatch)

const mapStateToProps = (state) => ({
    ...state.navigation,
    userShortDisplay: state.account.details.shortDisplay,
    payeeShortDisplay: state.business.traderScreenBusinessId ? state.business.businessList[state.business.traderScreenBusinessId].fields.username : '',
    loginFormOpen: state.login.loginFormOpen,
    passToUnlock: state.login.passToUnlock
})

export default connect(mapStateToProps, mapDispatchToProps)(Root)
