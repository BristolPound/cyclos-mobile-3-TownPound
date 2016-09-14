import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TextInput, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native'
import * as actions from '../store/reducer/sendMoney'
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

const SendMoney = (props) =>
  <View>
    <View style={style.heading}>
      <NavBarButton style={merge(style.cancelButton, style.button)} onPress={() => { props.cancel(); props.resetForm() }}>
        <DefaultText style={style.buttonText}>Cancel</DefaultText>
      </NavBarButton>
      <DefaultText style={style.headingText}>Send Money</DefaultText>
      <NavBarButton style={merge(style.sendButton, style.button)} onPress={() => props.loading ? undefined : props.sendTransaction()}>
        { props.loading
          ? <ActivityIndicator size='large' style={{flex: 1, backgroundColor: 'transparent'}}/>
          : <DefaultText style={style.buttonText}>Send</DefaultText>
        }
      </NavBarButton>
    </View>
    <View style={style.formGroup}>
      <DefaultText style={style.label}>To:</DefaultText>
      <TextInput
        style={style.textInput}
        value={props.payee}
        onChangeText={(payee) => props.updatePayee(payee)}
        placeholder='payee'/>
    </View>
    <View style={style.formGroup}>
      <DefaultText style={style.label}>£</DefaultText>
      <TextInput
        style={style.textInput}
        keyboardType='numeric'
        value={props.amount}
        onChangeText={(amount) => props.updateAmount(amount)}
        placeholder='amount'/>
    </View>
    { props.newTransaction && props.newTransaction.description
      ? <View>
          <DefaultText>{ props.newTransaction.description }</DefaultText>
        </View>
      : undefined
    }
    <View>
      <DefaultText>{props.paymentFailed}</DefaultText>
    </View>
  </View>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.sendMoney})

export default connect(mapStateToProps, mapDispatchToProps)(SendMoney)
