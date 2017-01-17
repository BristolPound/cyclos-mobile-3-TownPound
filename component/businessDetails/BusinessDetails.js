import React from 'react'
import Communications from 'react-native-communications'
import HTMLView from 'react-native-htmlview'
import { View, Linking, Image, TouchableOpacity } from 'react-native'
import { MultilineText } from '../DefaultText'
import addresses from '../../util/addresses'
import styles from './BusinessDetailsStyle'

const Field = ({icon, text, accessibilityLabel, onPress}) =>
  <View style={styles.field}>
    <Image style={styles.image} source={icon}/>
    <TouchableOpacity style={styles.item} accessibilityLabel={accessibilityLabel} onPress={onPress}>
      <MultilineText style={styles.text}>{text}</MultilineText>
    </TouchableOpacity>
  </View>

const renderFields = (fields) =>
  (fields.length > 0)
  ? <View>
      {fields.map((field) => (
        // 'key' is magic so isn't passed down into the method.
        // Hence define a duplicate accessibilityLabel.
        field
          ? <Field {...field} accessibilityLabel={field.key}/>
          : null
      ))}
    </View>
  : null

function getFields(business, goToLocation) {
  const fields = [],
      businessDetail = (key, icon, text, onPress) => ({ key, icon, text, onPress })

  // Order of display should be:
  //    access point*, special offer*, address, opening times*, phone number, email address
  // Note: access point and special offer aren't supported yet.
    business.address && fields.push(
      businessDetail('addressField', require('./assets/Address.png'), addresses.toString(business.address), () => goToLocation(business.address.location))
    )

    business.businessphone && fields.push(
      businessDetail('phoneField', require('./assets/Phone.png'), business.businessphone, () => Communications.phonecall(business.businessphone, true))
    )

    business.businessemail && fields.push(
      businessDetail('emailField', require('./assets/Email.png'), business.businessemail, () => Communications.email([business.businessemail], null, null, null, null))
    )

  return fields
}

// In theory the explicit onLinkPress is unnecessary, but the default onLinkPress handling fails with
// 'this._validateURL is not a function'
function renderDescription(description) {
  return (
    description
      ? <View style={{paddingTop: 12, paddingBottom: 12}}>
          <View style={styles.separator}/>
          <View style={styles.description} accessibilityLabel='Business Description'>
            <HTMLView value={description} onLinkPress={url => Linking.openURL(url)}/>
          </View>
        </View>
      : <View style={{ height: 12 }} />
  )
}

class BusinessDetails extends React.Component {
  render() {
    const fields = getFields(this.props.business, this.props.goToLocation)
    return <View style={fields.length > 1 ? styles.moreDetails : styles.addressOnly}>
        {renderFields(fields)}
        {renderDescription(this.props.business.description)}
    </View>
  }
}

export default BusinessDetails
