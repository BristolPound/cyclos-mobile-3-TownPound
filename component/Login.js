import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import DefaultText from './DefaultText'
import colors from '../util/colors'
import merge from '../util/merge'
import * as actions from '../store/reducer/login'
import PLATFORM from '../util/Platforms'
import commonStyle from './style'

const style = {
  loginContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ... commonStyle.shadow
  },
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
  separator: {
    height: 1,
    backgroundColor: colors.gray5
  }
}

class Login extends React.Component {
  constructor() {
    super()
    this.state = { keyboardHeight: 0 }
    // On iOS the keyboard is overlaid on top of the content,
    // while on android everything is moved up to make space
    if (PLATFORM.isIOS()) {
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
    if (PLATFORM.isIOS()) {
      this.keyboardShowListener.remove()
      this.keyboardHideListener.remove()
    }
  }

  selectPasswordField() {
    this.passwordInputRef.focus()
  }

  render() {
    return (
      <View style={merge(style.loginContainer, { bottom: this.state.keyboardHeight })}>
        <TouchableOpacity style={style.loginButton}
            accessibilityLabel={'Login Button'}
            onPress={() => this.props.login(this.props.username, this.props.password)}>
          <DefaultText style={style.loginButtonText}>Log in</DefaultText>
        </TouchableOpacity>
        <TextInput style={style.input}
            accessibilityLabel={'Input Username'}
            autoFocus={true}
            onChangeText={(text) => this.props.usernameUpdated(text)}
            onSubmitEditing={this.selectPasswordField.bind(this)}
            placeholder={'Username'}
            placeholderTextColor={colors.gray4}
            selectTextOnFocus={true}
            value={this.props.username} />
        <View style={style.separator}/>
        <TextInput style={style.input}
            ref={(ref) => this.passwordInputRef = ref}
            accessibilityLabel={'Input Password'}
            onChangeText={(text) => this.props.passwordUpdated(text)}
            onSubmitEditing={() => this.props.login(this.props.username, this.props.password)}
            placeholder={'Password'}
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
