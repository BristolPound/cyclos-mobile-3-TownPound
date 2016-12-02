import React from 'react'

import HTMLView from 'react-native-htmlview'
import { View, Text, TouchableOpacity, Linking, StyleSheet, Image } from 'react-native'

import { MultilineText } from '../DefaultText'
import commonStyle, { padding } from '../style'
import addresses from '../../util/addresses'
import colors from '../../util/colors'

const styles = {
  description: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 18,
  },
  minorButtonText: {
    fontFamily: commonStyle.font.museo500,
    alignSelf: 'center',
    color: colors.bristolBlue,
    backgroundColor: colors.transparent,
    fontSize: 14,
    marginTop: 18,
    paddingBottom: 8
  },
  separator: {
    borderBottomColor: colors.gray5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray5,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  field: {
    flexDirection: 'row',
    paddingTop: 1,
    backgroundColor: colors.white,
    marginTop: 18,
    marginLeft: 24,
    marginRight: 24
  },
  image: {
    height: 20,
    width: 18,
    marginRight: 16
  },
  item: {
    flexDirection:'column',
    flex: 1
  },
  text: {
    flex:1,
    fontSize: 16,
    color: colors.gray1,
    flexWrap: 'wrap'
  },
  addressOnly: {
    ...padding(18, 0, 30, 0)
  },
  moreDetails: {
    paddingBottom: 12
  }
}

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

    return <View style={fields.length > 1 ? styles.moreDetails : styles.addressOnly}>
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
        <View style={{marginBottom: 18}}>
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
  return description ?
    <View style={{paddingTop: 12}}>
      <View style={styles.separator}/>
      <View style={styles.description} accessibilityLabel='Business Description'>
        <HTMLView value={description} onLinkPress={url => Linking.openURL(url)}/>
      </View>
    </View>
    : null
}

function renderFields(fields) {
  return (fields.length > 0) ? <ViewFields fields={fields}/> : null
}

function renderExpander(expandDetailsFn) {
  return <View style={{paddingTop: 12}}>
            <View style={styles.separator}/>
            <TouchableOpacity
              onPress={expandDetailsFn}
              accessiblityLabel='View Full Details'>
              <View>
                <Text style={styles.minorButtonText}>VIEW DETAILS</Text>
              </View>
            </TouchableOpacity>
          </View>
}

const ViewFields = ({fields}) =>
    <View>
        {fields.map((field) => (
            // 'key' is magic so isn't passed down into the method.
            // Hence define a duplicate accessibilityLabel.
            field.text ?
                <Field key={field.key} icon={field.icon} text={field.text} accessibilityLabel={field.key}/>
                : null
        ))}
    </View>

const Field = ({icon, text, accessibilityLabel}) =>
    <View style={styles.field}>
        <Image style={styles.image} source={icon}/>
        <View style={styles.item} accessibilityLabel={accessibilityLabel}>
            <MultilineText style={styles.text}>{text}</MultilineText>
        </View>
    </View>

export default BusinessDetails
