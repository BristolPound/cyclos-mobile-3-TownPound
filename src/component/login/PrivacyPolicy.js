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
              Data permissions and privacy policy
            </Text>
          </View>
          <Text style={style.instructionText}>
          By using the Bristol Pound mobile application, you are giving your consent to the terms of this privacy policy and to the collection, processing and storage of your personal information for the purposes set forth herein. If you do not agree to this privacy policy, we ask that you desist from using the application as a way of opting out.

We reserve the right, at our discretion, to change this privacy policy at any time. Such change will be effective 30 days following posting of the revised privacy policy, and your continued use of the Services thereafter means that you accept those changes.

The Bristol Pound mobile application collects information for the purposes of improving the services we offer, and for effectively promoting services to you. The application collects data as aggregated, non-personally-identifiable information. This includes transaction dates and times, user types, approximate geolocations, usage patterns and data about the functioning of the application. Information about personal payments is not stored, nor is personally identifiable information about your transaction history or personal shopping habits. All payment data is pulled from and stored on the online banking server run by the Bristol Credit Union (BCU), and is covered under your separate data protection agreement directly with the BCU.

Your rights to access data stored about you remain as per our data protection policy at https://bristolpound.org/data-protection-pledge.
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
