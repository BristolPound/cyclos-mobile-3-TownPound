import React from 'react'
import { View } from 'react-native'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'

export default () =>
  <View style={{flex: 1}}>
    <BackgroundMap/>
    <View style={{flex:1}}/>
    <View style={{flex: 1, marginLeft: 20, marginRight: 20}}>
      <BusinessList/>
    </View>
  </View>
