import React from 'react'
import { View } from 'react-native'
import DefaultText from './DefaultText'
import merge from '../util/merge'

const Price = ({prefix, price, color, size, style, center}) => {
  const priceComponents = Math.abs(price).toFixed(2).split('.')
  const priceBeforeDecimal = priceComponents[0]
  const priceAfterDecimal = priceComponents[1]
  const isCredit = price > 0
  size = size || 25
  const smallFontSize = size * 0.8
  const margin = size * 0.06
  color = color ? color : (isCredit ? '#484' : 'black')
  prefix = prefix !== undefined ? prefix : (isCredit ? '+' : '')
  const alignment = center ? 'center': 'flex-end'
  return (
    <View style={merge(style, {justifyContent: alignment, flexDirection: 'row'})}>
      <DefaultText style={{fontSize: smallFontSize, alignSelf: alignment, marginBottom: margin, color}}>{prefix}</DefaultText>
      <DefaultText style={{fontSize: size, alignSelf: alignment, color}}>{priceBeforeDecimal}</DefaultText>
      <DefaultText style={{fontSize: smallFontSize, alignSelf: alignment, marginBottom: margin, color}}>.{priceAfterDecimal}</DefaultText>
    </View>
  )
}

export default Price
