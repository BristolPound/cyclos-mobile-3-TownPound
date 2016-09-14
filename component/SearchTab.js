import React from 'react'
import { View } from 'react-native'
import BackgroundMap from './BackgroundMap'
import BusinessList from './BusinessList'
import Dimensions from 'Dimensions'

const TAB_BAR_HEIGHT = 50
const TOP_BAR_HEIGHT = 24
const height = Dimensions.get('window').height - TOP_BAR_HEIGHT

const style = {
  businessList: {
    top: height / 2,
    marginLeft: 20,
    marginRight: 20,
    height: height / 2 - TAB_BAR_HEIGHT
  }
}

export default () =>
  <View style={{flex: 1}}>
    <BackgroundMap/>
    <View style={style.businessList}>
      <BusinessList/>
    </View>
  </View>
