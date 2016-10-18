import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import DefaultText from './DefaultText'
import Platform from 'Platform'
import colors from '../util/colors'
import merge from '../util/merge'
import * as actions from '../store/reducer/login'
import PLATFORM from '../stringConstants/platform'

const style = {
  loginButton: {
    flex: 1,
    height: 68,
    padding: 20,
    backgroundColor: colors.bristolBlue
  },
  loginButtonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center'
  },
  input: {
    height: 68,
    fontSize: 20,
    color: colors.bristolBlue,
    backgroundColor: 'white',
    textAlign: 'center'
  },
  separatorBelow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray5
  }
}

//TODO: make it focus username field again on second log in
class Login extends React.Component {
  constructor() {
    super()
    this.state = { keyboardHeight: 0 }
    // On iOS the keyboard is overlaid on top of the content,
    // while on android everything is moved up to make space
    if (Platform.OS === PLATFORM.IOS) {
      this.keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        (e) => this.setState({ keyboardHeight: e.endCoordinates.height })
      )
      this.keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => this.setState({ keyboardHeight: 0 })
      )
    }
  }

  componentWillUnmount() {
    if (Platform.OS === PLATFORM.IOS) {
      this.keyboardShowListener.remove()
      this.keyboardHideListener.remove()
    }
  }

  selectPasswordField() {
    this.passwordInputRef.focus()
  }

  render() {
    return (
      <View style={{ bottom: this.state.keyboardHeight }}>
        <TouchableOpacity style={style.loginButton}
            onPress={() => this.props.login(this.props.username, this.props.password)}>
          <DefaultText style={style.loginButtonText}>Log in</DefaultText>
        </TouchableOpacity>
        <TextInput style={merge(style.input, style.separatorBelow)}
            accessibilityLabel={'username'}
            autoFocus={true}
            onChangeText={(text) => this.props.usernameUpdated(text)}
            onSubmitEditing={this.selectPasswordField.bind(this)}
            placeholder={'username'}
            placeholderTextColor={colors.gray4}
            selectTextOnFocus={true}
            value={this.props.username} />
        <TextInput style={style.input}
            ref={(ref) => this.passwordInputRef = ref}
            accessibilityLabel={'password'}
            onChangeText={(text) => this.props.passwordUpdated(text)}
            onSubmitEditing={() => this.props.login(this.props.username, this.props.password)}
            placeholder={'password'}
            placeholderTextColor={colors.gray4}
            secureTextEntry={true}
            selectTextOnFocus={true}
            value={this.props.password} />
      </View> )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.login})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
