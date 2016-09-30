import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View } from 'react-native'

import merge from '../util/merge'
import * as actions from '../store/reducer/login'
import InputComponent from './InputComponent'

class Login extends React.Component {

  constructor() {
    super()
    this.state = {
      inputPage: 0,
    }
  }

  nextPage() {
    this.setState({ inputPage: (this.state.inputPage + 1) % 4 })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loginInProgress && !this.props.state.loginInProgress && this.state.inputPage === 2) {
      this.nextPage()
    }
  }

  render() {
    let inputProps = {
      onRequestClose: () => { this.props.resetForm(); this.setState({ inputPage: 0 }) },
    }

    switch (this.state.inputPage){
      case 0:
        inputProps = merge(inputProps, {
          buttonText: 'Enter username:',
          onButtonPress: () => { this.nextPage() },
          input: {
            keyboardType: 'default',
            value: this.props.state.username,
            placeholder: 'Username',
            onChangeText: this.props.usernameUpdated,
          },
          invalidInput: this.props.state.username.trim().length === 0,
        })
        break
      case 1:
        inputProps = merge(inputProps, {
          buttonText: 'Enter password:',
          onButtonPress: () => { this.props.login(this.props.state.username, this.props.state.password); this.nextPage() },
          input: {
            keyboardType: 'default',
            placeholder: 'password',
            onChangeText: this.props.passwordUpdated,
            value: this.props.state.password,
            secureTextEntry: true
          },
          invalidInput: this.props.state.password.length === 0,
        })
        break
      case 2:
        inputProps = merge(inputProps, {
          buttonText: 'Logging in',
          loading: true,
        })
        break
      case 3:
        inputProps = merge(inputProps, {
          buttonText: 'Login failed. ' + this.props.state.loginFailed,
          onButtonPress: () => { this.props.resetForm(); this.nextPage() },
        })
        break
    }

    return <View>
      { !this.props.state.loggedIn && this.props.state.open
        ? <InputComponent {...inputProps} />
        : undefined }
    </View>
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({state: state.login})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
