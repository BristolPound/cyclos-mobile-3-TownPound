import React from 'react'
import { View } from 'react-native'
import DefaultText from './DefaultText'
import merge from '../util/merge'
import colors from '../util/colors'
import commonStyle from './style'

const Price = ({prefix, price, color, size, style, center}) => {
  const priceComponents = Math.abs(price).toFixed(2).split('.')
  const priceBeforeDecimal = priceComponents[0]
  const priceAfterDecimal = priceComponents[1]
  const isCredit = price > 0
  size = size || 18
  const smallFontSize = size
  // TODO: determine a more robust way to calculate the bottom margin
  const margin = 0 //size * 0.06
  color = color || (isCredit ? colors.orange : colors.offBlack)
  prefix = prefix !== undefined ? prefix : (isCredit ? '+' : '')
  const alignment = center ? 'center': 'flex-end'
  return (
    <View style={merge(style, {justifyContent: alignment, flexDirection: 'row'})}>
      <DefaultText style={{fontFamily: commonStyle.font.museo500, fontSize: smallFontSize, alignSelf: alignment, marginBottom: margin, color}}>{prefix}</DefaultText>
      <DefaultText style={{fontFamily: commonStyle.font.museo500, fontSize: size, alignSelf: alignment, color}}>{priceBeforeDecimal}</DefaultText>
      <DefaultText style={{fontFamily: commonStyle.font.museo100, fontSize: smallFontSize, alignSelf: 'flex-end', marginBottom: margin, color, opacity: 0.6}}>.{priceAfterDecimal}</DefaultText>
    </View>
  )
}

export default Price
