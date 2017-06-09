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
import { closeConfirmation } from '../store/reducer/navigation'
import { updatePage, resetPayment } from '../store/reducer/sendMoney'
import UnlockAppAlert from './lockedState/UnlockAppAlert'

class Root extends React.Component {

  constructor () {
    super()
    this.state = {
      appState: AppState.currentState,
      coverApp: false,
      unlockError: false,
      failedAttempts: 0
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/) && this.state.appState === 'active') {
      this.setState({coverApp: true, appState: nextAppState})
    } else if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (this.props.passToUnlock!=='') {
        this.setState({askToUnlock: true, appState: nextAppState})
      } else {
        this.setState({coverApp: false, appState: nextAppState})
      }
    } else {
      this.setState({appState: nextAppState})
    }
  }

  checkPass (pass) {
    var encodedPass = md5(pass)
    if (encodedPass === this.props.passToUnlock) {
      this.setState({askToUnlock: false, coverApp: false, unlockError: false, failedAttempts: 0})
    } else {
      var failedAttempts = this.state.failedAttempts + 1
      if(failedAttempts < 5) {
        this.setState({unlockError: true, failedAttempts})
      } else {
        this.props.logout()
        this.props.closeConfirmation()
        this.props.resetPayment()
        this.setState({askToUnlock: false, coverApp: false, unlockError: false, failedAttempts: 0})
      }
    }
  }

  render() {
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
          {(this.props.modalOpen && !this.props.loginFormOpen) && Config.APP_CITY!=='Exeter' ? <SendMoney /> : undefined}
          <Login/>
          <StatusMessage/>
          {this.state.coverApp && <AppCover />}
          {this.props.passToUnlock!=='' && this.state.askToUnlock
             && <UnlockAppAlert checkPass={(pass) => this.checkPass(pass)} error={this.state.unlockError} failedAttempts={this.state.failedAttempts} />}
        </View>
      )
  }

}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ logout, closeConfirmation, updatePage, resetPayment }, dispatch)

const mapStateToProps = (state) => ({
    ...state.navigation,
    loginFormOpen: state.login.loginFormOpen,
    passToUnlock: state.login.passToUnlock
})

export default connect(mapStateToProps, mapDispatchToProps)(Root)
