import React from 'react'
import { View } from 'react-native'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import Dimensions from 'Dimensions'

const { height } = Dimensions.get('window')

export default () =>
  <View style={{flex: 1}}>
    <BackgroundMap/>
    <View style={{flex: 1, top: height / 2, marginLeft: 20, marginRight: 20}}>
      <BusinessList/>
    </View>
  </View>
