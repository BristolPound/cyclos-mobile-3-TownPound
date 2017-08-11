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

const Field = (props) => {
  if (props.icon) {
    return FieldWithIcon(props)
  }
  else {
    return FieldWithoutIcon(props)
  }
}

const FieldWithIcon = (props) => {

  const { icon, text, accessibilityLabel, onPress, additionalOption } = props

  return (
    <View style={styles.fieldIcon}>
      <Image style={styles.image} source={icon} resizeMode='contain'/>
      <View style={styles.item}>
        {renderFieldText(props)}
        {additionalOption && renderFieldText({...props, text: additionalOption.text})}
      </View>
    </View>
  )
}


const FieldWithoutIcon = (props) =>
  <View style={styles.fieldNoIcon}>
    <Text>{props.label}:</Text>
    {renderFieldText(props)}
  </View>


const renderFieldText = (props) => {
  return (
    Array.isArray(props.text)
    ? (_.map(props.text, (textItem, index) => {
      return (
        <FieldText key={index} {...props} text={textItem}/>
      )
    }))
    : (
      <FieldText {...props}/>
    )
  )
}

const FieldText = (props) => {
  const { accessibilityLabel, text, onPress } = props

  return (
    <TouchableOpacity
    accessibilityLabel={accessibilityLabel}
    disabled={!onPress}
    onPress={onPress}
    >
      <MultilineText
        style={styles.text}
      >
      {text}
      </MultilineText>
    </TouchableOpacity>
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


// This is a temporary solution and eventually will be superceded once the
// api returns an array of phone numbers instead of a slash separated setString
// (will use a new solution for both this and multiple addresses to render them all)
const phoneDetail = (business) => {
  let phoneNumbers = business.fields.businessphone.split("/")
  let additionalNumber = phoneNumbers.length == 2
  ? {text: phoneNumbers[1].trim(), onPress: () => Communications.phonecall(phoneNumbers[1].trim(), true)}
  : null

  return businessDetail('phoneField', Images.businessDetails.businessphone, phoneNumbers[0].trim(), () => Communications.phonecall(phoneNumbers[0].trim(), true), additionalNumber)

}

function getFields(business, goToTraderLocation, orderedFields, expanded) {
  const fields = []

  // Order of display already worked out in orderedFields based on Config
  // Note: special offer aren't supported yet.
  _.has(business.subCategories, 'cashpoint1') && fields.push(
    businessDetail('cashPoint1Field', Images.cashpoint1, business.subCategories.cashpoint1 +': '+ Config.CASH_POINT_1, () => {} )
  )

  _.has(business.subCategories, 'cashpoint2') && fields.push(
    businessDetail('cashPoint2Field', Images.cashpoint2, business.subCategories.cashpoint2 +': '+ Config.CASH_POINT_2, () => {} )
  )

  const pushMain = (fieldMetadata) => {
    fieldMetadata.id != "businessTeaser" &&
      fields.push(getBusinessesDetail(business, fieldMetadata, goToTraderLocation))
  }

  const pushPriority = (fieldMetadata) => {
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
  let icon = fieldMetadata.iconURL || Images.businessDetails[fieldMetadata.id]
  let accessibilityLabel = fieldMetadata.id.concat("Field")
  let callback
  // These are the 'exceptions' when a different type of callback is needed

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
