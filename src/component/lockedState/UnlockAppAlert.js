import React from 'React'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import DefaultText from '../DefaultText'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
import style from './UnlockAppAlertStyle'
import { unlockCharNo } from '../../store/reducer/login'

export const maxAttempts = 3;

const passwordValid = (password) => password && password.indexOf(' ') === -1 && password.length === unlockCharNo

class UnlockAppAlert extends React.Component {
    constructor() {
        super()
        this.state = {
            pass: ''
        }
    }

    _onChangeText (value) {
        this.setState({pass: value })
        if (!this.props.storePassword && value.length === unlockCharNo) {
            this.props.checkPass(value)
            this.setState({pass: '' })
            return
        }
    }

    render() {
        return (
            <View style={style.wrapper}>
                <View style={style.container}>
                    <View style={style.header}>
                      <Text style={style.headerText}>
                        {this.props.headerMessage || "Unlock App"}
                      </Text>
                    </View>
                    <Text style={style.instructionText}>
                        For your privacy, the app was locked.
                        To unlock, please enter the last {unlockCharNo} characters of your password. Or chose "Logout" to just browse
                    </Text>
                    { this.props.noInternet &&
                      <View>
                          <Text style={merge(style.errorText, { paddingTop: 10 })}>
                              No internet available right now, log out just to browse
                          </Text>
                      </View>
                    }
                    { this.props.error &&
                        <View>
                            <Text style={merge(style.errorText, { paddingTop: 10 })}>
                                The characters entered don't match.
                            </Text>
                            <Text style={merge(style.errorText, { paddingBottom: 10 })}>
                                You have {maxAttempts - this.props.failedAttempts} attempts left.
                            </Text>
                        </View>
                    }
                    <View style={style.form}/>
                    <View style={style.pinEntry}>
                      <TextInput
                          placeholder={'Last three characters of password'}
                          autoFocus={true}
                          value={this.state.pass}
                          maxLength={unlockCharNo}
                          accessibilityLabel={'Unlock code'}
                          style={style.textInput}
                          placeholderTextColor={Colors.gray4}
                          secureTextEntry={true}
                          underlineColorAndroid={Colors.transparent}
                          onChangeText={(value) => this._onChangeText(value)}>
                      </TextInput>
                    </View>
                    <View style={style.buttonRow}>
                        <TouchableOpacity
                            style={merge(style.buttonContainer, { backgroundColor: Colors.primaryBlue})}
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

export default UnlockAppAlert
