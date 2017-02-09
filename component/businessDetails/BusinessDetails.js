import React from 'react'
import Communications from 'react-native-communications'
import HTMLView from 'react-native-htmlview'
import { View, Linking, Image, TouchableOpacity, Text } from 'react-native'
import { MultilineText } from '../DefaultText'
import addresses from '../../util/addresses'
import styles from './BusinessDetailsStyle'
import merge from '../../util/merge'
import { goToLocation } from '../../store/reducer/navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

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
      : <View style={{ height: 12 }} />
    )
}


function getFields(business) {
  const fields = [],
      businessDetail = (key, icon, text, onPress) => ({ key, icon, text, onPress })

  // Order of display should be:
  //    access point*, special offer*, address, opening times*, phone number, email address
  // Note: access point and special offer aren't supported yet.
    business.address && fields.push(
      businessDetail('addressField', require('./assets/Address.png'), addresses.toString(business.address), () => goToLocation(merge(business.address.location, { latitudeDelta: 0.006, longitudeDelta: 0.006 })))
    )

    business.businessphone && fields.push(
      businessDetail('phoneField', require('./assets/Phone.png'), business.businessphone, () => Communications.phonecall(business.businessphone, true))
    )

    business.businessemail && fields.push(
      businessDetail('emailField', require('./assets/Email.png'), business.businessemail, () => Communications.email([business.businessemail], null, null, null, null))
    )

  return fields
}

const renderExpandedDetails = (expandedFields, description) => {
  return (
      <View>
        {renderFields(expandedFields)}
        {renderDescription(description)}
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
    const fields = getFields(this.props.business)
    let expandedFields = []

    if(fields.length > 2) {
      expandedFields = fields.slice(2)
      fields.length = 2
    }

    return (
      <View style={fields.length > 1 ? styles.moreDetails : styles.addressOnly}>
        {renderFields(fields)}
        {this.state.isExpanded 
          ? renderExpandedDetails(expandedFields, this.props.business.description)
          : ((fields.length > 2 || this.props.business.description)
              ? renderExpander(() => this.expandDetails())
              : undefined
            )
        }
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ goToLocation }, dispatch)

export default connect(mapDispatchToProps)(BusinessDetails)
