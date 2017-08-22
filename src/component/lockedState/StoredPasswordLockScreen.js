import React from 'React'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import DefaultText from '../DefaultText'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
import style from './StoredPasswordLockStyle'
import { unlockCharNo } from '../../store/reducer/login'

export const maxAttempts = 3;


class StoredPasswordLockScreen extends React.Component {
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
                    <Text style={style.instructionText}>
                        For your privacy, the app was locked.
                        To unlock, please enter the PIN you specified when agreeing to "Simplified Login". Or chose "Logout" to just browse.
                    </Text>
                    { this.props.error &&
                        <View>
                            <Text style={merge(style.errorText, { paddingTop: 10 })}>
                                The PIN you entered was incorrect. If you have forgotten the PIN, choose "Logout".
                            </Text>
                            <Text style={merge(style.errorText, { paddingBottom: 10 })}>
                                You have {maxAttempts - this.props.failedAttempts} attempts left.
                            </Text>
                        </View>
                    }
                    <View style={style.form}/>
                    <TextInput
                        placeholder="Enter PIN"
                        autoFocus={true}
                        value={this.state.enteredPIN}
                        maxLength={unlockCharNo}
                        accessibilityLabel={'Unlock PIN'}
                        style={style.input}
                        keyboardType='numeric'
                        maxLength={maxPinLength}
                        placeholderTextColor={Colors.gray4}
                        secureTextEntry={true}
                        underlineColorAndroid={Colors.transparent}
                        onChangeText={(value) => this.updateEnteredPIN(value)}>
                    </TextInput>
                    <View style={style.buttonRow}>
                        <TouchableOpacity
                          disabled={!this.inputValid()}
                          style={merge(style.buttonContainer, {backgroundColor: this.getButtonColor()})}
                          onPress={() => this.props.unlock()}
                        >
                          <Text style={merge(style.buttonText, {color: this.getButtonTextColor()})}>
                            Unlock
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={merge(style.buttonContainer, { backgroundColor: Colors.primaryBlue, flex: 1, marginRight: 2 })}
                            onPress={() => this.props.logout && this.props.logout()}>
                            <DefaultText style={merge(style.buttonText, { color: 'white' })}>
                                Logout
                            </DefaultText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default StoredPasswordLockScreen
