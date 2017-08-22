import React from 'React'
import { View, TouchableOpacity, Text, TextInput, ScrollView } from 'react-native'
import { MultilineText } from '../DefaultText'
import DefaultText from '@Colors/colors'
import style from './PolicyStyle'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
// import { passwordDisclaimer } from '@Config/config'


class PrivacyPolicy extends React.Component {
  constructor() {
    super()
    this.state = {
      enteredPIN: ''
    }
  }

  updateEnteredPIN(enteredPIN) {
    this.setState({
      enteredPIN: enteredPIN
    })
  }

  getButtonColor() {
    if (this.inputValid()) {
      return Colors.primaryBlue
    }
    else {
      return Colors.gray5
    }
  }

  getButtonTextColor() {
    return this.getButtonColor() === Colors.gray5 ? 'black' : 'white'
  }

  inputValid() {
    var len = this.state.enteredPIN.length
    if (len >= 4 && len <= 6) {
      return true
    }

    return false
  }


  render() {
    let maxPinLength = 6

    return (
      <View style={style.wrapper}>
        <View style={style.container}>
          <View style={style.header}>
            <Text style={style.headerText}>
              Password Disclaimer
            </Text>
          </View>
          <View style={style.separator}/>
          <ScrollView style={style.instructionWrapper}>
          <Text style={style.instructionText}>
              Password Disclaimer...
              Enter a PIN to be used instead for accessing and unlocking the app
          </Text>
          </ScrollView>
          <View style={style.pinEntry}>
            <TextInput
              style={style.textInput}
              value={this.state.enteredPIN}
              onChangeText={(enteredPIN) => this.updateEnteredPIN(enteredPIN)}
              placeholder="Enter an Unlock Pin"
              keyboardType='numeric'
              secureTextEntry={true}
              maxLength={maxPinLength}
            />
          </View>
          <View style={style.buttonRow}>
            <TouchableOpacity
              disabled={!this.inputValid()}
              style={merge(style.buttonContainer, {backgroundColor: this.getButtonColor()})}
              onPress={() => this.props.acceptCallback(this.state.enteredPIN)}
            >
              <Text style={merge(style.buttonText, {color: this.getButtonTextColor()})}>
                Accept
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={merge(style.buttonContainer, {borderWidth: 2, borderColor: Colors.primaryBlue})}
              onPress={this.props.rejectCallback}
            >
              <Text style={merge(style.buttonText, {color: Colors.primaryBlue})}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

export default PrivacyPolicy
