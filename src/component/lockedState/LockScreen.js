import React from 'React'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logout } from '../../store/reducer/login'
import { closeConfirmation, setCoverApp, navigateToTab, hideModal, setOverlayOpen } from '../../store/reducer/navigation'
import UnlockAppAlert from './UnlockAppAlert'
import StoredPasswordLockScreen from './StoredPasswordLockScreen'


class LockScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      unlockError: false,
      failedAttempts: 0
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
    return (
      <View>
        {this.props.storePassword
          ?   <StoredPasswordLockScreen
                unlock={() => console.log("attempted unlock")}
                error={this.state.unlockError}
                failedAttempts={this.state.failedAttempts}
                logout={() => this.logoutPress()}
              />
          :  <UnlockAppAlert
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
