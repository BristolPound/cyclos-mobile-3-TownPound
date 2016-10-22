import React from 'react'
import { View, Image } from 'react-native'
import color from '../../util/colors'
import DefaultText from '../DefaultText'

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    backgroundColor: color.gray5
  },
  text: {
    color: color.gray3
  },
  image: {
    marginBottom: 24
  }
}

export const emptyStateImage = {
  spending: 'spending',
  map: 'map',
  account: 'account'
}

const getImageSource = (image) => {
  switch(image) {
    case emptyStateImage.spending:
      return require('./Spending.png')
    case emptyStateImage.map:
      return require('./Map.png')
    case emptyStateImage.account:
      return require('./Account.png')
  }
}

const LoginToView = (props) =>
  <View style={styles.container}>
    <Image style={styles.image} source={getImageSource(props.image)} />
    <DefaultText style={styles.text}>{props.lineOne}</DefaultText>
    <DefaultText style={styles.text}>{props.lineTwo}</DefaultText>
  </View>

export default LoginToView
