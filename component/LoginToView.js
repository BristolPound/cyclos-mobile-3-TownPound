import React from 'react'
import { View, Image } from 'react-native'
import color from '../util/colors'
import DefaultText from './DefaultText'

const styles = {
  container: {
    flex: 1,
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    backgroundColor: color.gray5
  },
  text: {
    fontFamily: 'MuseoSans-300',
    fontSize: 30,
    color: color.gray2
  }
}
const LoginToView = () =>
  <View style={styles.container}>
    <Image source={require('./tabbar/Spending_inactive@3x.png')} />
    <DefaultText style={styles.text}>Log in to view</DefaultText>
    <DefaultText style={styles.text}>your spending history</DefaultText>
  </View>

export default LoginToView
