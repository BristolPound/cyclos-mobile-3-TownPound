import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, TextInput, Animated } from 'react-native'
import DefaultText from '../DefaultText'
import colors from '../../util/colors'
import merge from '../../util/merge'
import animateTo from '../../util/animateTo'
import * as actions from '../../store/reducer/login'
import commonStyle from '../style'
import KeyboardComponent from '../KeyboardComponent'

const style = {
  loginContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  animatedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    ...commonStyle.shadow
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
    const loginView = (
      <Animated.View style={merge(style.loginContainer, { bottom: this.state.bottom, height: 204 + this.state.keyboardHeight })}>
        <View style={merge(style.loginContainer, { bottom: this.state.keyboardHeight })}>
          <TouchableOpacity style={style.loginButton}
              accessibilityLabel={'Login Button'}
              onPress={() => this.props.login(this.props.username, this.props.password)}>
            <DefaultText style={style.loginButtonText}>Log in</DefaultText>
          </TouchableOpacity>
          { this.props.hideUsernameInput
            ? undefined
            : <TextInput style={style.input}
                accessibilityLabel={'Input Username'}
                autoFocus={true}
                onChangeText={(text) => this.props.usernameUpdated(text)}
                onSubmitEditing={this.selectPasswordField.bind(this)}
                placeholder={'Username'}
                placeholderTextColor={colors.gray4}
                selectTextOnFocus={true}
                value={this.props.username} />
          }
          <View style={style.separator}/>
          <TextInput style={style.input}
              ref={(ref) => this.passwordInputRef = ref}
              accessibilityLabel={'Input Password'}
              autoFocus={this.props.hideUsernameInput}
              onChangeText={(text) => this.props.passwordUpdated(text)}
              onSubmitEditing={() => this.props.login(this.props.username, this.props.password)}
              placeholder={'Password'}
              placeholderTextColor={colors.gray4}
              secureTextEntry={true}
              selectTextOnFocus={true}
              value={this.props.password} />
        </View>
      </Animated.View>
    )
    return this.props.loginFormOpen ? loginView : <View style={{ height: 0 }}/>
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.login})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
