import React from 'react'
import { View, TouchableHighlight, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { openLoginForm } from '../store/reducer/login'
import color from '../util/colors'

const style =  {
  visible: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.5
  },
  hidden: {
    position: 'absolute',
    height: 0
  }
}

const LoginOverlay = (props) =>
  <TouchableHighlight
    style={props.loginFormOpen ? style.visible : style.hidden}
    onPress={() => props.openLoginForm(false)}
    underlayColor={color.transparent}>
    <View/>
  </TouchableHighlight>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ openLoginForm }, dispatch)

const mapStateToProps = (state) => ({
  loginFormOpen: state.login.loginFormOpen
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginOverlay)
