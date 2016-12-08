import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, TextInput, Animated } from 'react-native'
import DefaultText from '../DefaultText'
import colors from '../../util/colors'
import merge from '../../util/merge'
import animateTo from '../../util/animateTo'
import { horizontalAbsolutePosition } from '../../util/StyleUtils'
import * as actions from '../../store/reducer/login'
import commonStyle from '../style'
import KeyboardComponent from '../KeyboardComponent'

const style = {
  loginContainer: {
    ...horizontalAbsolutePosition(0, 0),
    backgroundColor: 'white',
    ...commonStyle.shadow
  },
  loginButton: {
    flex: 1,
    height: 68,
    padding: 20,
  },
  loginButtonText: {
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

// Cyclos doesn't like special characters or empty usernames :(
const isValid = (username) => username && !username.match(/\W/)

class Login extends KeyboardComponent {
  constructor() {
    super()
  }

  selectPasswordField() {
    this.passwordInputRef.focus()
  }

  componentDidUpdate(lastProps) {
    if (this.props.loginFormOpen && !lastProps.loginFormOpen) {
      const bottom = new Animated.Value(-204)
      this.setState({ bottom })
      animateTo(bottom, 0, 500)
    }
  }

  render() {
    const { username, password, hideUsernameInput, login, usernameUpdated, passwordUpdated } = this.props
    const loginView = (
      <Animated.View style={merge(style.loginContainer, { bottom: this.state.keyboardHeight, height: hideUsernameInput ? 136 : 204 })}>
        <Animated.View style={{ bottom: this.state.bottom}}>
          <TouchableOpacity style={{ ...style.loginButton, backgroundColor: isValid(username) ? colors.bristolBlue : colors.offWhite }}
              accessibilityLabel={'Login Button'}
              onPress={() => isValid(username) && login(username, password)}>
            <DefaultText style={{ ...style.loginButtonText, color: isValid(username) ? 'white' : 'black' }}>Log in</DefaultText>
          </TouchableOpacity>
          { hideUsernameInput
            ? undefined
            : <TextInput style={style.input}
                accessibilityLabel={'Input Username'}
                autoFocus={true}
                onChangeText={(text) => usernameUpdated(text)}
                onSubmitEditing={this.selectPasswordField.bind(this)}
                placeholder={'Username'}
                placeholderTextColor={colors.gray4}
                selectTextOnFocus={true}
                value={username} />
          }
          <View style={style.separator}/>
          <TextInput style={style.input}
              ref={(ref) => this.passwordInputRef = ref}
              accessibilityLabel={'Input Password'}
              autoFocus={hideUsernameInput}
              onChangeText={(text) => passwordUpdated(text)}
              onSubmitEditing={() => login(username, password)}
              placeholder={'Password'}
              placeholderTextColor={colors.gray4}
              secureTextEntry={true}
              selectTextOnFocus={true}
              value={password} />
        </Animated.View>
      </Animated.View>
    )
    return this.props.loginFormOpen ? loginView : <View style={{ height: 0 }}/>
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.login})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
