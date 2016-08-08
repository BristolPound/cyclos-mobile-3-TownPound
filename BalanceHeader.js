import React from 'react'
import { View } from 'react-native'
import DefaultText from './DefaultText'
import Price from './Price'
import merge from './merge'
import color from './colors'

const styles = {
  headingContainer: {
    margin: 10,
    padding: 5,
    backgroundColor: color.bristolBlue,
    flex: 1
  },
  subtitle: {
    color: '#ddd',
    fontSize: 15
  },
  header: {
    backgroundColor: '#1480ba',
    flexDirection: 'row'
  }
}

const BalanceHeader = ({loadingBalance, balance}) =>
  <View style={styles.header}>
    <View style={merge(styles.headingContainer, {alignItems: 'flex-start'})}>
      <Price price={loadingBalance ? 0 : balance} prefix='£' color='white' size={35}/>
      <DefaultText style={styles.subtitle}>Your account</DefaultText>
    </View>
    <View style={merge(styles.headingContainer, {alignItems: 'flex-end'})}>
      <Price price={0} prefix='£' color='white' size={35}/>
      <DefaultText style={styles.subtitle}>Spent today</DefaultText>
    </View>
  </View>

export default BalanceHeader
