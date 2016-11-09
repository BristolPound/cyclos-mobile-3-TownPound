import React from 'react'
import { View } from 'react-native'
import DefaultText from '../DefaultText'
import Price from '../Price'
import {format} from '../../util/date'
import styles from './ProfileStyle'
/**
 * Render a row representing a single transaction.
 */
const TransactionItem = (transaction) =>
  <View style={styles.list.rowContainer} key={transaction.transactionNumber}>
    <View style={styles.rowLayout}>
      <DefaultText style={styles.list.date}>{format(transaction.date, 'DD MMMM')}</DefaultText>
      <DefaultText style={styles.list.transactionNumber}>{transaction.transactionNumber}</DefaultText>
      <Price
        style={styles.list.price}
        size={20}
        price={transaction.amount}/>
    </View>
  </View>

export default TransactionItem