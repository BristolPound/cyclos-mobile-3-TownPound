import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity, TextInput } from 'react-native'
import DefaultText from './DefaultText'
import Platform from 'Platform'
import colors from '../util/colors'
import merge from '../util/merge'

import * as actions from '../store/reducer/login'

const style = {
  containerIOS: {
    position: 'absolute',
    bottom: 216
  },
  containerAndroid: {
    bottom: 0
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
    color: colors.bristolBlue
  },
  separatorBelow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray5
  }
}

//TODO: make it focus username field again on second log in
class Login extends React.Component {
  selectPasswordField() {
    this.passwordInputRef.focus()
  }

  render() {
    return (
      <View style={Platform.OS === 'ios' ? style.containerIOS : style.containerAndroid}>
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
