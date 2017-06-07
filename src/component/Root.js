import React from 'react'
import Tabs from './Tabs'
import { View, StatusBar, AppState } from 'react-native'
import ReturningLogin from './login/ReturningLogin'
import Onboarding from './login/Onboarding'
import { mainComponent } from '../store/reducer/navigation'
import { connect } from 'react-redux'
import Login from './login/Login'
import LoginOverlay from './login/LoginOverlay'
import StatusMessage from './StatusMessage'
import Colors from '@Colors/colors'
import Config from '@Config/config'
import SendMoney from './sendMoney/SendMoney'
import AppCover from './AppCover'

class Root extends React.Component {

  constructor () {
    super()
    this.state = {
      appState: AppState.currentState,
      coverApp: false
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
      this.setState({coverApp: false, appState: nextAppState})
    } else {
      this.setState({appState: nextAppState})
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
          {AppState.currentState !== 'active' && <AppCover />}
        </View>
      )
  }

}

const mapStateToProps = (state) => ({
    ...state.navigation,
    loginFormOpen: state.login.loginFormOpen
})

export default connect(mapStateToProps)(Root)
