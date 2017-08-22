import React from 'React'
import { View, AppState } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logout } from '../../store/reducer/login'
import { closeConfirmation, setCoverApp, navigateToTab, hideModal, setOverlayOpen } from '../../store/reducer/navigation'
import UnlockAppAlert from './UnlockAppAlert'
import { updatePage, resetPayment, resetForm } from '../../store/reducer/sendMoney'
import StoredPasswordLockScreen from './StoredPasswordLockScreen'


class LockScreen extends React.Component {

  constructor(props) {
    super(props)
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

  render() {
    if (!this.state.askToUnlock) {
      return <View style={{ height: 0 }}/>
    }
    return (
      this.props.storePassword
        ?   <StoredPasswordLockScreen
              unlock={() => console.log("attempted unlock")}
              error={this.state.unlockError}
              failedAttempts={this.state.failedAttempts}
              logout={() => this.logoutPress()}
            />
        :   <UnlockAppAlert
              checkPass={(pass) => this.checkPass(pass)}
              error={this.state.unlockError}
              failedAttempts={this.state.failedAttempts}
              logout={() => this.logoutPress()}
            />
    )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    logout,
    hideModal,
    closeConfirmation,
    updatePage,
    setCoverApp,
    navigateToTab,
    setOverlayOpen,
    resetForm
  }, dispatch)


const mapStateToProps = (state) => ({
  passToUnlock: state.login.passToUnlock,
  storePassword: state.login.storePassword
})

export default connect(mapStateToProps, mapDispatchToProps)(LockScreen)
