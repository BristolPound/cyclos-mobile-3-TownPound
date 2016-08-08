import React from 'react'
import { Text } from 'react-native'

const defaultTextStyle = {
  fontFamily: 'HelveticaNeue-Light',
  fontSize: 18
}

const DefaultText = ({ style, children, ...otherProps }) =>
  <Text style={Object.assign({}, defaultTextStyle, style)} {...otherProps}>
    {children}
  </Text>

export default DefaultText
