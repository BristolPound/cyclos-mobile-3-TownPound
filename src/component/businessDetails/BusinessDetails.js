import React from 'react'
import Communications from 'react-native-communications'
import HTMLView from 'react-native-htmlview'
import { View, Linking, Image, TouchableOpacity, Text } from 'react-native'
import { MultilineText } from '../DefaultText'
import addressToString from '../../util/addresses'
import styles from './BusinessDetailsStyle'
import Images from '@Assets/images'
import Config from '@Config/config'
import _ from 'lodash'

const Field = ({icon, text, accessibilityLabel, onPress, additionalOption, label}) => {
  if (icon) {
    return fieldWithIcon(icon, text, accessibilityLabel, onPress, additionalOption)
  }
  else {
    return fieldWithoutIcon(label, text, accessibilityLabel)
  }
}

const fieldWithIcon = (icon, text, accessibilityLabel, onPress, additionalOption) =>
  <View style={styles.field}>
    <Image style={styles.image} source={icon} resizeMode='contain'/>
    <View style={styles.item}>
      <TouchableOpacity accessibilityLabel={accessibilityLabel} onPress={onPress}>
        <MultilineText style={styles.text}>{text}</MultilineText>
      </TouchableOpacity>
      {additionalOption &&
      <TouchableOpacity accessibilityLabel={accessibilityLabel} onPress={onPress}>
        <MultilineText style={styles.text}>{additionalOption.text}</MultilineText>
      </TouchableOpacity>}
    </View>
  </View>

const fieldWithoutIcon = (label, text, accessibilityLabel) => {

  console.log(label)
  return (
    <Text>
      Other field type - {label}
    </Text>
  )

}



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


const businessDetail = (key, icon, text, onPress, additionalOption = null, label = '') =>
  ({ key, icon, text, onPress, additionalOption, label })

const phoneDetail = (business) => {
  let phoneNumbers = business.fields.businessphone.split("/")
  let additionalNumber = phoneNumbers.length == 2
  ? {text: phoneNumbers[1].trim(), onPress: () => Communications.phonecall(phoneNumbers[1].trim(), true)}
  : null

  return businessDetail('phoneField', Images.phone, phoneNumbers[0].trim(), () => Communications.phonecall(phoneNumbers[0].trim(), true), additionalNumber)

}

function getFields(business, goToTraderLocation, orderedFields, expanded) {
  const fields = []
  const priorityFields = []

  // Order of display should be:
  //    cash point, special offer*, address, opening times*, phone number, email address
  // Note: special offer aren't supported yet.
    _.has(business.subCategories, 'cashpoint1') && fields.push(
      businessDetail('cashPoint1Field', Images.cashpoint1, business.subCategories.cashpoint1 +': '+ Config.CASH_POINT_1, () => {} )
    )

    _.has(business.subCategories, 'cashpoint2') && fields.push(
      businessDetail('cashPoint2Field', Images.cashpoint2, business.subCategories.cashpoint2 +': '+ Config.CASH_POINT_2, () => {} )
    )

    // business.fields.memberdiscount && fields.push(
    //   businessDetail('discountField', Images.deal, business.fields.memberdiscount, () => {} )
    // )
    //
    // business.address.location && fields.push(
    //   businessDetail('addressField', Images.address, addressToString(business.address), goToTraderLocation )
    // )
    //
    // business.fields.businessphone && fields.push(phoneDetail())
    //
    // business.fields.businessemail && fields.push(
    //   businessDetail('emailField', Images.email, business.fields.businessemail, () => Communications.email([business.fields.businessemail], null, null, null, null))
    // )
    //
    // business.fields.facebook && fields.push(
    //   businessDetail('facebookField', Images.facebook, business.name, () => Communications.web(business.fields.facebook))
    // )
    //
    // business.fields.businesswebsite && fields.push(
    //       businessDetail('websiteField', Images.website, business.fields.businesswebsite, () => Communications.web(business.fields.businesswebsite))
    // )
    //
    // business.fields.twitter && fields.push(
    //       businessDetail('twitterField', Images.twitter, business.fields.twitter.split("@").join(""), () => Communications.web("https://www.twitter.com/" + business.fields.twitter.split("@").join("")))
    // )
    //
    // business.fields.linkedin && fields.push(
    //       businessDetail('linkedinField', Images.linkedin, business.name, () => Communications.web(business.fields.linkedin))
    // )
    //
    // business.fields.flickr && fields.push(
    //       businessDetail('flickrField', Images.flickr, business.name, () => Communications.web(business.fields.flickr))
    // )
    //
    // business.fields.businessopeninghours && fields.push(
    //   businessDetail('openingHoursField', Images.opening, business.fields.businessopeninghours, () => {})
    // )

    const pushMain = (fieldMetadata) => {
      fieldMetadata.id != "businessTeaser" &&
        fields.push(getBusinessesDetail(business, fieldMetadata, goToTraderLocation))
    }

    const pushPriority = (fieldMetadata) => {
      console.log("the priorityView is " + fieldMetadata.priorityView + " for " + fieldMetadata.label)
      fieldMetadata.priorityView &&
        fields.push(getBusinessesDetail(business, fieldMetadata, goToTraderLocation))
    }


    _.forEach(orderedFields, (fieldMetadata) => {
      if (_.has(business.fields, fieldMetadata.id)) {
        expanded ? pushMain(fieldMetadata) : pushPriority(fieldMetadata)
      }
    })


  return { fields, priorityFields }
}

const getBusinessesDetail = (business, fieldMetadata, goToTraderLocation) => {

  let businessField = business.fields[fieldMetadata.id]
  let icon = fieldMetadata.iconURL || Images[fieldMetadata.id]
  let accessibilityLabel = fieldMetadata.id.concat("Field")
  let callback
  // These are the 'exceptions' when a different type of callback is needed
  // switch (fieldMetadata.id) {
  //   case "twitter":
  //     callback = () => Communications.web("https://www.twitter.com/" + businessField.split("@").join(""))
  //     break
  //   case "businessemail":
  //     callback = () => Communications.email([businessField], null, null, null, null)
  //     break
  //   case "businessphone":
  //     // Checks for multiple phone numbers etc. May change if an array is
  //     // returned from api instead of a slash separated value
  //     return phoneDetail(business)
  //   case "addresses":
  //     // Just return the first address for now
  //     return businessDetail('addressField', Images.address, addressToString(businessField[0]), goToTraderLocation )
  //   default:
  //     text = businessField
  //     callback = icon
  //       ? () => Communications.web(businessField)
  //       : () => {}
  // }

  const handleString = () => {
    switch (fieldMetadata.displayType) {
      case "EMAIL":
        callback = () => Communications.email([businessField], null, null, null, null)
        break
      case "TWITTER":
        callback = () => Communications.web("https://www.twitter.com/" + businessField.split("@").join(""))
        break
      default:
        callback = null
    }
  }


  switch (fieldMetadata.type) {
    case "STRING":
      if (fieldMetadata.displayType == "PHONE") {
        return phoneDetail(business)
      }
      else {
        handleString()
      }
      break
    case "URL":
      callback = () => Communications.web(businessField)
      break
    case "ADDRESS":
      businessField = addressToString(businessField[0])
      callback = goToTraderLocation
      break
    case "TEXT":
      callback = null
      break
    default:
      callback = null
  }


  return businessDetail(accessibilityLabel, icon, businessField, callback, null, fieldMetadata.label)

}


const renderExpandedDetails = (expandedFields, description) => {
  return (
      <View>
        {renderFields(expandedFields)}
        {description ? renderDescription(description) : undefined}
      </View>
    )
}


class BusinessDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isExpanded: props.isExpanded }
    this.expandDetails = this.expandDetails.bind(this)
  }

  expandDetails() {
    const newExpanded = !this.state.isExpanded
    this.setState({isExpanded: newExpanded})
  }

  renderExpander() {
    return(
      <View style={{paddingTop: 12}}>
        <View style={styles.separator}/>
        <TouchableOpacity
          onPress={this.expandDetails}
          accessiblityLabel='View Full Details'>
          <View>
            <Text style={styles.minorButtonText}>{this.state.isExpanded ? "COLLAPSE" : "EXPAND"} DETAILS</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }


  render() {
    const expanded = this.state.isExpanded
    const { business, goToTraderLocation, orderedFields } = this.props
    const { fields } = getFields(business, goToTraderLocation, orderedFields, expanded)
    // let expandedFields = []

    // if(fields.length > 2) {
    //   expandedFields = fields.slice(2)
    //   fields.length = 2
    // }

    return (
      <View style={fields.length > 1 ? styles.moreDetails : styles.addressOnly}>
        {renderFields(fields)}
        {(fields.length > 0)
          && this.renderExpander()
        }
      </View>
    )
  }
}

export default BusinessDetails
