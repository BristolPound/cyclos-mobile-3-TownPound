import React from 'react'
import { View, TouchableHighlight } from 'react-native'
import DefaultText from '../DefaultText'
import Price from '../Price'
import {format} from '../../util/date'
import color from '../../util/colors'
import styles from './ProfileStyle'
/**
 * Render a row representing a single transaction.
 */

export default class TransactionItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { transaction, setSelected, selected } = this.props
    return (
      <TouchableHighlight
          onPress={() => setSelected(transaction.transactionNumber, !selected)}
          underlayColor={color.transparent}
          key={transaction.transactionNumber}>
          <View style={styles.list.columnContainer}>
            <View style={styles.list.rowContainer}>
                <DefaultText style={styles.list.date}>{format(transaction.date, 'DD MMMM')}</DefaultText>
                <DefaultText style={styles.list.time}>{format(transaction.date, 'hh:mm:ss')}</DefaultText>
                <Price
                  style={styles.list.price}
                  size={20}
                  price={transaction.amount}/>
            </View>
            {selected && <View style={styles.list.rowContainer}>
              <DefaultText style={styles.list.transactionNumber}>{transaction.transactionNumber}</DefaultText>
            </View>}
          </View>
      </TouchableHighlight>
    )
  }
}
