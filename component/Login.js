import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableOpacity } from 'react-native'
import DefaultText from './DefaultText'
import Platform from 'Platform'

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
    height: 50
  }
}

class Login extends React.Component {

  render() {
    if (!this.props.loginFormOpen) {
      return <View style={{ height: 0 }}/>
    }
    return (
      <View style={Platform.OS === 'ios' ? style.containerIOS : style.containerAndroid}>
        <TouchableOpacity style={style.loginButton}
            onPress={() => this.props.login(this.props.username, this.props.password)}>
          <DefaultText>Log in</DefaultText>
        </TouchableOpacity>
      </View> )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.login})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
