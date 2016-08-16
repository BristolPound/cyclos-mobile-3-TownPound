import React from 'react'
import { View } from 'react-native'
import DefaultText from './DefaultText'

const Price = ({prefix, price, color, size}) => {
  const priceComponents = Math.abs(price).toFixed(2).split('.')
  const isCredit = price > 0
  size = size || 25
  const smallFontSize = size * 0.7
  const margin = size * 0.08
  color = color ? color : (isCredit ? '#484' : 'black')
  prefix = prefix || (isCredit ? '+' : '')
  return (
    <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
      <DefaultText style={{fontSize: smallFontSize, alignSelf: 'flex-end', marginBottom: margin, color}}>{prefix}</DefaultText>
      <DefaultText style={{fontSize: size, alignSelf: 'flex-end', color}}>{priceComponents[0]}</DefaultText>
      <DefaultText style={{fontSize: smallFontSize, alignSelf: 'flex-end', marginBottom: margin, color}}>.{priceComponents[1]}</DefaultText>
    </View>
  )
}

export default Price
