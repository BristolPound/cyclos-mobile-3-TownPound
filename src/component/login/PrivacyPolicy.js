import React from 'React'
import { View, TouchableOpacity, Text } from 'react-native'
import DefaultText from '@Colors/colors'
import style from './PrivacyPolicyStyle'
import Colors from '@Colors/colors'
import merge from '../../util/merge'


class PrivacyPolicy extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <View style={style.wrapper}>
        <View style={style.container}>
          <View style={style.header}>
            <Text style={style.headerText}>
              Privacy Policy
            </Text>
          </View>
          <Text style={style.instructionText}>
            Please accept the privacy policy (config text to go here)
          </Text>
          <View style={style.buttonRow}>
            <TouchableOpacity
              style={merge(style.buttonContainer, {backgroundColor: Colors.primaryBlue})}
              onPress={this.props.acceptCallback}
            >
              <Text style={style.buttonText}>
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
