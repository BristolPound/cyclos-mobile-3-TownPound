import React from 'react'
import { View, TextInput, StyleSheet, TouchableHighlight } from 'react-native'
import DefaultText from './DefaultText'
import color from '../util/colors'
import merge from '../util/merge'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/login'

const style = {
  formGroup: {
    margin: 10,
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    flexDirection: 'row'
  },
  label: {
    width: 90
  },
  textInput: {
    flex: 1,
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 18,
    marginLeft: 10
  },
  disabled: {
    opacity: 0.5
  },
  heading: {
    backgroundColor: color.bristolBlue,
    alignItems: 'center',
    padding: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headingText: {
    color: 'white',
    fontWeight: 'bold'
  },
  loginButton: {
    margin: 10,
    padding: 5,
    backgroundColor: color.bristolBlue,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  loginText: {
    color: 'white'
  }
}

const OptionalTextInput = ({enabled, value, ...otherProps}) =>
  enabled
    ? <TextInput
        style={style.textInput}
        value={value}
        {...otherProps}/>
    : <DefaultText style={merge(style.textInput, style.disabled)}>{value}</DefaultText>

const Login = (props) =>
  <View>
    <View style={style.heading}>
      <DefaultText style={style.headingText}>Login</DefaultText>
    </View>
    <View style={style.formGroup}>
      <DefaultText style={style.label}>Username:</DefaultText>
      <OptionalTextInput
        enabled={!props.state.loginInProgress}
        onChangeText={props.usernameUpdated}
        value={props.state.username}/>
    </View>
    <View style={style.formGroup}>
      <DefaultText style={style.label}>Password:</DefaultText>
      <OptionalTextInput
        enabled={!props.state.loginInProgress}
        onChangeText={props.passwordUpdated}
        value={props.state.password}/>
    </View>
    <TouchableHighlight style={style.loginButton}
        onPress={() => {
          if (!props.state.loginInProgress) {
            props.login(props.state.username, props.state.password)
          }
        }}>
      <View>
        <DefaultText style={style.loginText}>Login</DefaultText>
      </View>
    </TouchableHighlight>
    { props.state.loginFailed
      ? <View style={style.formGroup}>
          <DefaultText>Login failed :-(</DefaultText>
        </View>
      : <View/> }
  </View>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({state: state.login})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
