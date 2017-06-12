import React from'React'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import DefaultText from '../DefaultText'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
import style from './UnlockAppAlertStyle'
import { unlockCharNo } from '../../store/reducer/login'

export const maxAttempts = 5;

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
                        To unlock, please enter the last {unlockCharNo} characters of your password
                    </Text>
                    { this.props.error &&
                        <View>
                            <Text style={style.errorText}>
                                You have {maxAttempts - this.props.failedAttempts} attempts left.
                            </Text>
                            <Text style={style.errorText}>
                                The characters entered don't match.
                            </Text>
                        </View>
                    }
                    <View style={style.form}/>
                    <TextInput
                        placeholder={'Password'}
                        autoFocus={true}
                        value={this.state.pass}
                        accessibilityLabel={'Password'}
                        style={style.input}
                        placeholderTextColor={Colors.gray4}
                        secureTextEntry={true}
                        underlineColorAndroid={Colors.transparent}
                        onChangeText={(value) => this._onChangeText(value)}>
                    </TextInput>
                    <TouchableOpacity
                        style={merge(style.buttonContainer, { backgroundColor: passwordValid(this.state.pass) ? Colors.primaryBlue : Colors.offWhite})}
                        onPress={() => passwordValid(this.state.pass) && this.props.checkPass(this.state.pass)}>
                        <DefaultText style={merge(style.buttonText, { color: passwordValid(this.state.pass) ? 'white' : 'black' })}>
                            Unlock
                        </DefaultText>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default UnlockAppAlert
