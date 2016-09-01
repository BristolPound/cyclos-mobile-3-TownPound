import React, { Component } from 'react'
import { View, TextInput, StyleSheet, TouchableHighlight } from 'react-native'
import DefaultText from './DefaultText'
import color from '../util/colors'
import merge from '../util/merge'

const style = {
  formGroup: {
    margin: 10,
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    flexDirection: 'row'
  },
  label: {
    width: 40
  },
  textInput: {
    flex: 1,
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 18,
    marginLeft: 10
  },
  heading: {
    backgroundColor: color.bristolBlue,
    alignItems: 'center',
    padding: 10,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headingText: {
    color: 'white',
    fontWeight: 'bold'
  },
  button: {
    position: 'absolute',
    width: 90
  },
  sendButton: {
    right: 5,
    alignItems: 'flex-end'
  },
  cancelButton: {
    left: 5
  },
  buttonText: {
    color: 'white'
  }
}

const NavBarButton = ({style, children, onPress}) =>
  <TouchableHighlight style={style} onPress={onPress}>
    <View>
      {children}
    </View>
  </TouchableHighlight>

class SendMoney extends Component {

  constructor(props) {
    super(props)

    this.state = {
      payee: '',
      amount: '0'
    }
  }

  _send() {
    // putTransaction({
    //   payeeUserName: this.state.payee,
    //   description: 'This is a test',
    //   amount: this.state.amount
    // })
    // .then((res) => console.log(res))
    // .catch((err) => console.error(err))
  }

  render() {
    return (
      <View>
        <View style={style.heading}>
          <DefaultText style={style.headingText}>Send Money</DefaultText>
          <NavBarButton style={merge(style.sendButton, style.button)} onPress={this._send.bind(this)}>
            <DefaultText style={style.buttonText}>Send</DefaultText>
          </NavBarButton>
        </View>
        <View style={style.formGroup}>
          <DefaultText style={style.label}>To:</DefaultText>
          <TextInput
            style={style.textInput}
            value={this.state.payee}
            onChangeText={(payee) => this.setState({payee})}
            placeholder='payee'/>
        </View>
        <View style={style.formGroup}>
          <DefaultText style={style.label}>£</DefaultText>
          <TextInput
            style={style.textInput}
            value={this.state.amount}
            onChangeText={(amount) => this.setState({amount})}
            placeholder='amount'/>
        </View>
      </View>
    )
  }
}

export default SendMoney
