import React from 'react'
import { View } from 'react-native'
import DefaultText from '../DefaultText'
import Price from '../Price'
import {format} from '../../util/date'
import styles from './ProfileStyle'
/**
 * Render a row representing a single transaction.
 */

const TransactionItem = (transaction) => {
  const dateString = format(transaction.date, 'Do')
  return (
    <View key={transaction.transactionNumber} style={styles.list.rowContainer}>
      <View style={styles.list.leftColumn}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <DefaultText style={styles.list.dateNumbers}>{dateString.substring(0, dateString.length - 2)}</DefaultText>
          <DefaultText style={styles.list.dateLetters}>{dateString.substring(dateString.length - 2, dateString.length)}</DefaultText>
        </View>
        <DefaultText style={styles.list.day}>{format(transaction.date, 'dddd')}</DefaultText>
      </View>
      <View style={styles.list.midColumnOuter}>
        <View style={styles.list.midColumnInner}>
          <DefaultText style={styles.list.timeText}>{format(transaction.date, 'HH:mm:ss')}</DefaultText>
          <DefaultText style={styles.list.idText}>{transaction.transactionNumber}</DefaultText>
        </View>
      </View>
      <Price
        style={styles.list.price}
        size={27}
        price={transaction.amount}/>
    </View>
  )
}

export default TransactionItem
