import React from 'React'
import { View, AppState } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { authenticate } from '../../api/api'
import md5 from 'md5'
import { logout, storedPasswordUnlock, LOGIN_STATUSES } from '../../store/reducer/login'
import AppCover from './AppCover'
import { closeConfirmation, setCoverApp, navigateToTab, hideModal, setOverlayOpen } from '../../store/reducer/navigation'
import UnlockAppAlert, {maxAttempts} from './UnlockAppAlert'
import { updatePage, resetPayment, resetForm } from '../../store/reducer/sendMoney'
import StoredPasswordLockScreen from './StoredPasswordLockScreen'
import style from './StoredPasswordLockStyle'
import decrypt from '../../util/decrypt'
import moment from 'moment'


class LockScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
      unlockError: false,
      failedAttempts: 0,
      noInternet: false,
      lockTimeStamp: null,
      headerMessage: ''
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
      this.setState(
        { appState: nextAppState,
          lockTimeStamp: moment()
        }
      )
    } else if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      var diff = moment().diff(this.state.lockTimeStamp, 'seconds')
      console.log("the difference is " + diff)
      if ((diff >= 5) && (this.props.passToUnlock !== '' || this.props.loginStatus === LOGIN_STATUSES.LOGGED_IN)) {
        this.setState({askToUnlock: true, appState: nextAppState})
      } else {
        // this.props.setCoverApp(false)
        this.setState({appState: nextAppState})
      }
    } else {
      this.setState({appState: nextAppState})
    }
  }

  checkPass (pass) {
    var encodedPass = md5(pass)
    if (encodedPass === this.props.passToUnlock) {
      this.unlock()
    }
    else {
      this.failedAttempt()
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

  unlock() {
    this.props.setCoverApp(false)
    this.setState({askToUnlock: false, unlockError: false, failedAttempts: 0})

    this.props.postUnlock && this.props.postUnlock()
  }

  failedAttempt() {
    var failedAttempts = this.state.failedAttempts + 1
    if (failedAttempts < maxAttempts) {
      this.setState({unlockError: true, failedAttempts})
    }
    else {
      this.props.resetPayment()
      this.logout()
    }
  }

  setHeader(set, message) {
    if (set) {
      this.setState({headerMessage: message})
    }
    else {
      this.setState({headerMessage: ''})
    }
  }

  storedPasswordUnlock(code) {
    // If no internet then set state noInternet to true and return
    // else set it to false and carry on
    if (!this.props.connection) {
      this.setState({noInternet: true})
      return
    }
    else {
      this.setState({noInternet: false})
    }

    this.setHeader(true, "Unlocking...")
    console.log("unlocking...")

    return (this.props.storedPasswordUnlock(code)
      .then((successObject) => {
        console.log("success obj success is " + successObject.success)
        this.setHeader(false)
        successObject.success
          ? this.unlock()
          : successObject.authError
            ? this.failedAttempt()
            : this.setHeader(true, "Temporarily Blocked")

        return successObject
      })
      .catch(() => {
        this.setHeader(true, "Unknown Error")
        return false
      })
    )
  }

  // checkEncryptionKey() {
  //   console.log("the encryptionKey is " + this.props.encryptionKey)
  //   var username = this.props.loggedInUsername
  //   var password = decrypt(this.props.encryptedPassword, this.props.encryptionKey)
  //
  //   console.log(password)
  // }

  render() {
    if (!this.state.askToUnlock && !this.props.loginReplacement) {
      return <View style={{ height: 0 }}/>
    }
    return (
      <View style={style.wrapper}>
        {this.props.coverApp
            && <AppCover unlockOpened={this.props.passToUnlock!=='' && this.state.askToUnlock}/>
        }
        {this.props.storePassword
          ?   <StoredPasswordLockScreen
                unlock={this.storedPasswordUnlock.bind(this)}
                error={this.state.unlockError}
                failedAttempts={this.state.failedAttempts}
                logout={() => this.logoutPress()}
                noInternet={this.state.noInternet}
                headerMessage={this.state.headerMessage}
              />
          :   <UnlockAppAlert
                checkPass={(pass) => this.checkPass(pass)}
                error={this.state.unlockError}
                failedAttempts={this.state.failedAttempts}
                logout={() => this.logoutPress()}
                noInternet={this.state.noInternet}
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
    setCoverApp,
    navigateToTab,
    setOverlayOpen,
    resetPayment,
    resetForm,
    storedPasswordUnlock
  }, dispatch)


const mapStateToProps = (state) => ({
  ...state.navigation,
  passToUnlock: state.login.passToUnlock,
  storePassword: state.login.storePassword,
  loginStatus: state.login.loginStatus,
  encryptedPassword: state.login.encryptedPassword,
  encryptionKey: state.login.encryptionKey,
  connection: state.networkConnection.status
})

export default connect(mapStateToProps, mapDispatchToProps)(LockScreen)
