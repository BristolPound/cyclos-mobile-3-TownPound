import React from 'react'
import { View, TouchableHighlight, Animated, } from 'react-native'
import ProfileImage from '../profileImage/ProfileImage'
import Price from '../Price'
import Colors from '@Colors/colors'
import styles from './spendingStyle'
import DefaultText from '../DefaultText'


const TransactionRow = (props) => {
  const {
    transaction,
    openDetailsModal,
    businessList,
    getTransactionImage,
    getUserCategory
  } = props

  return (
    <View style={styles.container}>
      <TouchableHighlight
        onPress={() => transaction.relatedAccount.user && openDetailsModal(transaction.relatedAccount.user)}
        underlayColor={Colors.transparent}
        key={transaction.transactionNumber}>
        <View style={styles.row.container}>
          <ProfileImage
            image={getTransactionImage(transaction.relatedAccount.user, businessList)}
            style={styles.row.image}
            category={getUserCategory(transaction.relatedAccount.user, businessList)}
            colorCode={transaction.colorCode}/>
          <View style={styles.row.textContainer}>
            <DefaultText style={styles.row.text}>
              { transaction.relatedAccount.user ? transaction.relatedAccount.user.display : 'System' }
            </DefaultText>
            <Price price={transaction.amount} style={styles.row.price} size={22}/>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  )

}

export default TransactionRow
