import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, TextInput, Image, Animated } from 'react-native'
import DefaultText from '../DefaultText'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
import animateTo from '../../util/animateTo'
import { beginLogin, acceptPrivacyPolicy, setStorePassword } from '../../store/reducer/login'
import KeyboardComponent from '../KeyboardComponent'
import PrivacyPolicy from './PrivacyPolicy'
import styles from './LoginStyle'
import Images from '@Assets/images'
import Checkbox from 'react-native-check-box'
import decrypt from '../../util/decrypt'


// Cyclos doesn't like special characters or empty usernames :(
const detailsValid = (username, password) => username && !username.match(/\W/) && password && password.indexOf(' ') === -1

class Login extends KeyboardComponent {
  constructor(props) {
    super()
    this.state.username = props.loggedInUsername
    if (props.storePassword && props.encryptedPassword) {
      console.log("encrypted password detected")
      this.state.password = decrypt(props.encryptedPassword, 'test key')
    }
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

  beginLogin() {
    this.props.beginLogin(this.state.username, this.state.password)
  }

  passwordUpdated(newPassword) {
    this.setState({ password: newPassword })
  }

  usernameUpdated(newUsername) {
    this.setState({ username: newUsername })
  }

  setStorePassword() {
    this.props.setStorePassword()
  }

  render() {
    let loginButtonText = 'Log in'
    const { acceptPrivacyPolicy } = this.props
    const loginView = (
      <Animated.View style={merge(styles.outerContainer, { bottom: this.state.keyboardHeight })}>
        <Animated.View style={merge(styles.loginContainer, { bottom: this.state.bottom })}>
          <TouchableOpacity style={{ ...styles.loginButton, backgroundColor: detailsValid(this.state.username, this.state.password) ? Colors.primaryBlue : Colors.offWhite }}
              accessibilityLabel={'Login Button'}
              onPress={() => detailsValid(this.state.username, this.state.password) && this.beginLogin()}>
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
              onSubmitEditing={() => this.beginLogin()}
              placeholder={'Password'}
              placeholderTextColor={Colors.gray4}
              value={this.state.password}
              secureTextEntry={true}
              selectTextOnFocus={true}
              underlineColorAndroid={Colors.transparent} />
          <View style={styles.separator}/>
          <View style={styles.storePasswordContainer}>
            <Checkbox
              style={styles.checkbox}
              onClick={() => this.setStorePassword()}
              isChecked={this.props.storePassword}
              leftText={"Store Password"}
              checkedImage={<Image source={Images.check_box} style={styles.checkboxImage}/>}
              unCheckedImage={<Image source={Images.check_box_blank} style={styles.checkboxImage}/>}
              leftTextStyle={styles.checkboxLeftText}
            />
          </View>
        </Animated.View>
      </Animated.View>
    )
    return (
      this.props.loginFormOpen
        ? this.props.privacyPolicyOpen
          ? <PrivacyPolicy
              acceptCallback={() =>
                acceptPrivacyPolicy(true, this.state.username, this.state.password)}
              rejectCallback={() => acceptPrivacyPolicy(false)}
            />
          : loginView
        : <View style={{ height: 0 }}/>
      )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ beginLogin, acceptPrivacyPolicy, setStorePassword }, dispatch)

const mapStateToProps = (state) => ({...state.login})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
