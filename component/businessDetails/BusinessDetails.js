import React from 'react'
import {View, Image} from 'react-native'
import DefaultText from '../DefaultText'
import styles from './BusinessDetailsStyle'

const BusinessDetails = ({business}) => {
  let businessFields = []

  let addressLines = []
  if (business.address) {
    if (business.address.addressLine1) { addressLines.push(business.address.addressLine1) }
    if (business.address.addressLine2) { addressLines.push(business.address.addressLine2) }
    if (business.address.zip) { addressLines.push(business.address.zip) }
  }

  businessFields.push({
    attrId: 'addressField',
    icon: require('./Address.png'),
    fieldText: addressLines.join(', ')
  })

  if (business.openingTimes) {
    businessFields.push({
        attrId: 'openingField',
        icon: require('./Opening times.png'),
        fieldText: business.businessopeningtimes // TODO: FIND THIS!
    })
  }

  if (business.businessemail) {
    businessFields.push({
        attrId: 'emailField',
        icon: require('./Email.png'),
        fieldText: business.businessemail
    })
  }
  if (business.businessphone) {
    businessFields.push({
        attrId: 'phoneField',
        icon: require('./Phone.png'),
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

export default BusinessDetails
