import React from 'react'
import {View, Image} from 'react-native'
import DefaultText from '../DefaultText'
import colors from '../../util/colors'

const styles = {
  container: {
    marginBottom: 18
  },
  row: {
    flexDirection: 'row',
    paddingTop: 1,
    backgroundColor: colors.white,
    marginTop: 18,
    marginLeft: 24,
    marginRight: 24
  },
  image: {
    height: 26,
    width: 18,
    marginTop: 1,
    marginRight:16
  },
  text: {
    flex:1,
    fontSize: 16,
    color: colors.grey1,
    flexWrap: 'wrap'
  }
}

export const BusinessDetails = ({business}) => {
  let businessFields = []

  let addressLines = []
  if (business.address) {
    if (business.address.addressLine1) { addressLines.push(business.address.addressLine1) }
    if (business.address.addressLine2) { addressLines.push(business.address.addressLine2) }
    if (business.address.zip) { addressLines.push(business.address.zip) }
  }

  businessFields.push({
    attrId: 'addressField',
    icon: require('./temp_location.png'),
    fieldText: addressLines.join(', ')
  })

  if (business.openingTimes) {
    businessFields.push({
        attrId: 'openingField',
        icon: require('./temp_opening.png'),
        fieldText: business.businessopeningtimes // TODO: FIND THIS!
    })
  }

  if (business.businessemail) {
    businessFields.push({
        attrId: 'emailField',
        icon: require('./temp_email.png'),
        fieldText: business.businessemail
    })
  }
  if (business.businessphone) {
    businessFields.push({
        attrId: 'phoneField',
        icon: require('./temp_phone.png'),
        fieldText: business.businessphone
    })
  }

  return (
    <View style={styles.container}>
      {businessFields.map((singleField) => (
        singleField.fieldText
          ? <BusinessField
              key={singleField.attrId}
              icon={singleField.icon}
              fieldText={singleField.fieldText}
            />
          : null
      ))}
    </View>
  )
}

const BusinessField = ({icon, fieldText}) =>
  <View style={styles.row}>
    <Image style={styles.image} source={icon}/>
    <View style={{flexDirection:'column', flex: 1}}>
      <DefaultText style={styles.text}>{fieldText}</DefaultText>
    </View>
  </View>
