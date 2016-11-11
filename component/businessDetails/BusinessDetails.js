import React from 'react'

import HTMLView from 'react-native-htmlview'
import {View, Text, TouchableOpacity, Linking } from 'react-native'

import styles from '../profileScreen/ProfileStyle' // Really ought to be a differently named file.
import ViewFields from './ViewFields'
import addresses from '../../util/addresses'

// If expanded, display all items and the description.
// If not expanded, then display only the first two (non-description) items, as well as a link to display any more.
class BusinessDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {isExpanded: props.isExpanded}
  }

  render() {
    const fields = getFields(this.props.business)
    const expanded = this.renderExpandedDetails(fields, this.props.business.description)

    if (fields.length > 2) {
      fields.length = 2
    }

    return <View>
      {renderFields(fields)}
      { expanded }
    </View>
  }


  // if there's a description render it either as html or a view details button.
  // Ironically the details to be displayed is the description, not the business details (address etc.)
  // that are always displayed.
  renderExpandedDetails(fields, description) {
    let expanded = null
    if (this.state.isExpanded) {
      const expandedFields = (fields.length > 2) ?
        fields.slice(2) : []
      expanded =
        <View>
          {renderFields(expandedFields)}
          {renderDescription(description)}
        </View>
    } else if (fields.length > 2 || description) {
      // there are details that could be expanded.
      expanded = renderExpander(() => this.expandDetails())
    }
    // else no details to expand.
    return expanded
  }

  expandDetails() {
    this.setState({isExpanded: true})
  }
}

function getFields(business) {
  const fields = []

  // Order of display should be:
  //    access point*, special offer*, address, opening times*, phone number, email address
  // Note: access point and special offer aren't supported yet.
  // TODO: The businessopeningtimes field isn't in the dev database so hasn't been tested.
  if (business.address) {
    fields.push({
      key: 'addressField',
      icon: require('./Address.png'),
      text: addresses.toString(business.address)
    })
  }
  if (business.openingTimes) {
    fields.push({
      key: 'openingField',
      icon: require('./Opening times.png'),
      text: business.businessopeningtimes
    })
  }
  if (business.businessphone) {
    fields.push({
      key: 'phoneField',
      icon: require('./Phone.png'),
      text: business.businessphone
    })
  }
  if (business.businessemail) {
    fields.push({
      key: 'emailField',
      icon: require('./Email.png'),
      text: business.businessemail
    })
  }
  return fields
}

// In theory the explicit onLinkPress is unnecessary, but the default onLinkPress handling fails with
// 'this._validateURL is not a function'
function renderDescription(description) {
  return (description) ?
    <View>
      <View style={styles.separator}/>
      <View style={styles.businessDetails.description} accessibilityLabel='Business Description'>
        <HTMLView value={description} onLinkPress={(url) => Linking.openURL(url)}/>
      </View>
    </View>
    : null
}

function renderFields(fields) {
  return (fields.length > 0) ? <ViewFields fields={fields}/> : null
}

function renderExpander(expandDetailsFn) {
  return <View>
    <View style={styles.separator}/>
    <TouchableOpacity
      onPress={expandDetailsFn}
      accessiblityLabel='View Full Details'
    >
      <View><Text style={styles.minorButton.text}>View Details</Text></View>
    </TouchableOpacity>
  </View>
}

export default BusinessDetails