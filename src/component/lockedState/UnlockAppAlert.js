import React from'React'
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
    }

    render() {
        return (
            <View style={style.wrapper}>
                <View style={style.container}>
                    <Text style={style.instructionText}>
                        To protect your privacy, we have locked the login area.
                        To unlock, please enter the last {unlockCharNo} characters of your password. Or chose "Logout" to just browse
                    </Text>
                    { this.props.error &&
                        <View>
                            <Text style={merge(style.errorText, { paddingTop: 10 })}>
                                You have {maxAttempts - this.props.failedAttempts} attempts left.
                            </Text>
                            <Text style={merge(style.errorText, { paddingBottom: 10 })}>
                                The characters entered don't match.
                            </Text>
                        </View>
                    }
                    <View style={style.form}/>
                    <TextInput
                        placeholder={'Unlock code'}
                        autoFocus={true}
                        accessibilityLabel={'Password'}
                        value={''}
                        style={style.input}
                        placeholderTextColor={Colors.gray4}
                        secureTextEntry={true}
                        underlineColorAndroid={Colors.transparent}
                        onChangeText={(value) => this._onChangeText(value)}>
                    </TextInput>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={merge(style.buttonContainer, { backgroundColor: Colors.primaryBlue, flex: 1, marginRight: 2 })}
                            onPress={() => this.props.logout && this.props.logout()}>
                            <DefaultText style={merge(style.buttonText, { color: 'white' })}>
                                Logout
                            </DefaultText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={merge(style.buttonContainer, { flex: 1, marginLeft: 2, backgroundColor: passwordValid(this.state.pass) ? Colors.primaryBlue : Colors.offWhite})}
                            onPress={() => passwordValid(this.state.pass) && this.props.checkPass(this.state.pass)}>
                            <DefaultText style={merge(style.buttonText, { color: passwordValid(this.state.pass) ? 'white' : 'black' })}>
                                Unlock
                            </DefaultText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default UnlockAppAlert
