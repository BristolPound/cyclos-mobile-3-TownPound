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
import moment from 'moment'
import Colors from '@Colors/colors'
import { Overlay } from '../common/Overlay'


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
      if ((diff >= 5) && (this.props.passToUnlock !== '' || this.props.loginStatus === LOGIN_STATUSES.LOGGED_IN)) {
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
      this.unlock()
    }
    else {
      this.failedAttempt()
    }
  }

  resetState(){
    this.setState({askToUnlock: false, unlockError: false, failedAttempts: 0, headerMessage: ''})
  }

  logout () {
    this.props.logout()
    this.props.closeConfirmation()
    this.resetState()
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
    this.resetState()

    this.props.postUnlock && this.props.postUnlock()
  }

  failedAttempt() {
    var failedAttempts = this.state.failedAttempts + 1
    this.setHeader(false)
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
      this.setState({ headerMessage: message })
    }
    else {
      this.setState({ headerMessage: '' })
    }
  }

  componentWillReceiveProps(nextProps) {
    // If a failed unlock attmept was noticed, deduct an attempt
    if (nextProps.statusMessage !== this.props.statusMessage) {
      nextProps.statusMessage == 'Incorrect Unlock'
        && this.failedAttempt()
      nextProps.statusMessage == 'Temporarily blocked'
        && this.logout()
    }

    if (nextProps.storePassword !== this.props.storePassword
      && !nextProps.storePassword) {
        this.resetState()
      }

  }

  storedPasswordUnlock(code) {
    // If no internet then set state noInternet to true and return
    // else set it to false and carry on
    if (!this.props.connection) {
      this.setState({ noInternet: true })
      this.setHeader(false)
      return
    }
    else {
      this.setState({noInternet: false})
    }

    this.setHeader(true, "Unlocking...")

    return (this.props.storedPasswordUnlock(code)
      .then((success) => {
        this.setHeader(false)
        success && this.unlock()

        return success
      })
      .catch(() => {
        return false
      })
    )
  }


  render() {
    if (!this.state.askToUnlock && !this.props.loginReplacement) {
      return <View style={{ height: 0 }}/>
    }
    return (
      <View style={style.wrapper}>
        {this.props.coverApp
            && <AppCover unlockOpened={this.props.passToUnlock!=='' && this.state.askToUnlock}/>
        }
        <Overlay overlayVisible={this.state.headerMessage ? true : false}
                 onPress={() => {}}
                 underlayColor={Colors.transparent}/>
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
  connection: state.networkConnection.status,
  statusMessage: state.statusMessage.message
})

export default connect(mapStateToProps, mapDispatchToProps)(LockScreen)
