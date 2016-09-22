import React from 'react'
import {View, Image} from 'react-native'
import DefaultText from '../DefaultText'

const styles = {
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white'
  },
  image: {
  },
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
    <View>
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
  <View style={styles.container}>
    <Image style={styles.image} source={icon}/>
      <DefaultText>{fieldText}</DefaultText>
  </View>
