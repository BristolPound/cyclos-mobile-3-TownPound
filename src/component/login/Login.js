import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, TextInput, Animated } from 'react-native'
import DefaultText from '../DefaultText'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
import animateTo from '../../util/animateTo'
import { login } from '../../store/reducer/login'
import KeyboardComponent from '../KeyboardComponent'
import styles from './LoginStyle'

// Cyclos doesn't like special characters or empty usernames :(
const detailsValid = (username, password) => username && !username.match(/\W/) && password && password.indexOf(' ') === -1

class Login extends KeyboardComponent {
  constructor(props) {
    super()
    this.state.username = props.loggedInUsername
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
    if (!this.props.loginFormOpen && lastProps.loginFormOpen) {
      this.setState({ password: undefined })
    }
    if (this.props.loggedInUsername !== lastProps.loggedInUsername) {
      this.setState({ username: this.props.loggedInUsername })
    }
  }

  login() {
    this.props.login(this.state.username, this.state.password)
  }

  passwordUpdated(newPassword) {
    this.setState({ password: newPassword })
  }

  usernameUpdated(newUsername) {
    this.setState({ username: newUsername })
  }

  render() {
    let loginButtonText = 'Log in'
    const loginView = (
      <Animated.View style={merge(styles.outerContainer, { bottom: this.state.keyboardHeight })}>
        <Animated.View style={merge(styles.loginContainer, { bottom: this.state.bottom })}>
          <TouchableOpacity style={{ ...styles.loginButton, backgroundColor: detailsValid(this.state.username, this.state.password) ? Colors.primaryBlue : Colors.offWhite }}
              accessibilityLabel={'Login Button'}
              onPress={() => detailsValid(this.state.username, this.state.password) && this.login()}>
            <DefaultText style={{ ...styles.loginButtonText, color: detailsValid(this.state.username, this.state.password) ? 'white' : 'black' }}>
              {loginButtonText}
            </DefaultText>
          </TouchableOpacity>
          <TextInput style={styles.input}
              accessibilityLabel={'Input Username'}
              autoFocus={this.state.username === ''}
              onChangeText={(text) => this.usernameUpdated(text)}
              onSubmitEditing={this.selectPasswordField.bind(this)}
              placeholder={'Username'}
              placeholderTextColor={Colors.gray4}
              selectTextOnFocus={true}
              value={this.state.username}
              underlineColorAndroid={Colors.transparent}
              autoCorrect={false} />
          <View style={styles.separator}/>
          <TextInput style={styles.input}
              ref={(ref) => this.passwordInputRef = ref}
              accessibilityLabel={'Input Password'}
              autoFocus={this.state.username !== ''}
              onChangeText={(text) => this.passwordUpdated(text)}
              onSubmitEditing={() => this.login()}
              placeholder={'Password'}
              placeholderTextColor={Colors.gray4}
              secureTextEntry={true}
              selectTextOnFocus={true}
              underlineColorAndroid={Colors.transparent} />
        </Animated.View>
      </Animated.View>
    )
    return this.props.loginFormOpen ? loginView : <View style={{ height: 0 }}/>
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ login }, dispatch)

const mapStateToProps = (state) => ({...state.login})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
