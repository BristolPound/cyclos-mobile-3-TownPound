import React from 'React'
import { View, TouchableOpacity, Text, ScrollView, Linking } from 'react-native'
import { MultilineText } from '../DefaultText'
import DefaultText from '@Colors/colors'
import style from './PolicyStyle'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
import { privacyPolicy } from '@Config/config'
import HTMLView from 'react-native-htmlview'


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
          <View style={style.separator}/>
          <ScrollView style={style.instructionWrapper}>
            <HTMLView stylesheet={style.instructionTextHTML} value={privacyPolicy.replace(/\\n/g, '')} onLinkPress={url => Linking.openURL(url)}/>
          </ScrollView>
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
