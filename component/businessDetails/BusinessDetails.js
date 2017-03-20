import React from 'react'
import Communications from 'react-native-communications'
import HTMLView from 'react-native-htmlview'
import { View, Linking, Image, TouchableOpacity, Text } from 'react-native'
import { MultilineText } from '../DefaultText'
import addressToString from '../../util/addresses'
import { businessHasAddress, getBusinessAddress, getBusinessName } from '../../util/business'
import styles from './BusinessDetailsStyle'

const Field = ({icon, text, accessibilityLabel, onPress}) =>
  <View style={styles.field}>
    <Image style={styles.image} source={icon}/>
    <TouchableOpacity style={styles.item} accessibilityLabel={accessibilityLabel} onPress={onPress}>
      <MultilineText style={styles.text}>{text}</MultilineText>
    </TouchableOpacity>
  </View>

const renderFields = (fields) =>
  <View>
    {fields.map((field) => (
      // 'key' is magic so isn't passed down into the method.
      // Hence define a duplicate accessibilityLabel.
      field
        ? <Field {...field} accessibilityLabel={field.key}/>
        : null
    ))}
  </View>

const renderExpander = (expandDetailsFn) => 
  <View style={{paddingTop: 12}}>
    <View style={styles.separator}/>
    <TouchableOpacity
      onPress={expandDetailsFn}
      accessiblityLabel='View Full Details'>
      <View>
        <Text style={styles.minorButtonText}>VIEW DETAILS</Text>
      </View>
    </TouchableOpacity>
  </View>

const renderDescription = (description) => {
  return (
    description
      ? <View style={{ paddingTop: 12 }}>
          <View style={styles.separator}/>
          <View style={styles.description} accessibilityLabel='Business Description'>
            <HTMLView value={description.replace(/\\n/g, '')} onLinkPress={url => Linking.openURL(url)} />
          </View>
        </View>
      : null
    )
}
  



function getFields(business, goToTraderLocation) {
  const fields = [],
      businessDetail = (key, icon, text, onPress) => ({ key, icon, text, onPress })

      console.log(business)
  // Order of display should be:
  //    access point*, special offer*, address, opening times*, phone number, email address
  // Note: access point and special offer aren't supported yet.
    businessHasAddress(business) && fields.push(
      businessDetail('addressField', require('./assets/Address.png'), addressToString(getBusinessAddress(business)), goToTraderLocation )
    )

    business.fields.businessphone && fields.push(
      businessDetail('phoneField', require('./assets/Phone.png'), business.fields.businessphone.value, () => Communications.phonecall(business.fields.businessphone.value, true))
    )

    business.fields.businessemail && fields.push(
      businessDetail('emailField', require('./assets/Email.png'), business.fields.businessemail.value, () => Communications.email([business.fields.businessemail.value], null, null, null, null))
    )

    business.fields.facebook && fields.push(
      businessDetail('facebookField', require('./assets/Facebook.png'), getBusinessName(business), () => Communications.web(business.fields.facebook.value))
    )

    business.fields.businesswebsite && fields.push(
          businessDetail('websiteField', require('./assets/Website.png'), business.fields.businesswebsite.value, () => Communications.web(business.fields.businesswebsite.value))
    )

    business.fields.twitter && fields.push(
          businessDetail('twitterField', require('./assets/Twitter.png'), business.fields.twitter.value.split("@").join(""), () => Communications.web("https://www.twitter.com/" + business.fields.twitter.value.split("@").join("")))
    )

    business.fields.linkedin && fields.push(
          businessDetail('linkedinField', require('./assets/Linkedin.png'), getBusinessName(business), () => Communications.web(business.fields.linkedin.value))
    )

  return fields
}

const renderExpandedDetails = (expandedFields, description) => {
  return (
      <View>
        {renderFields(expandedFields)}
        {description ? renderDescription(description.value) : undefined}
      </View>
    )
}


class BusinessDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isExpanded: props.isExpanded }
  }

  expandDetails() {
    this.setState({isExpanded: true})
  }

  render() {
    const fields = getFields(this.props.business, this.props.goToTraderLocation)
    let expandedFields = []

    if(fields.length > 2) {
      expandedFields = fields.slice(2)
      fields.length = 2
    }

    return (
      <View style={fields.length > 1 ? styles.moreDetails : styles.addressOnly}>
        {renderFields(fields)}
        {this.state.isExpanded 
          ? renderExpandedDetails(expandedFields, this.props.business.fields.description)
          : ((expandedFields.length > 0 || this.props.business.fields.description)
              ? renderExpander(() => this.expandDetails())
              : undefined
            )
        }
      </View>
    )
  }
}

export default BusinessDetails
