import React from 'react'
import { View, Image } from 'react-native'
import color from '../../util/colors'
import DefaultText from '../DefaultText'
import { margin } from '../../util/StyleUtils';

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.offWhite
  },
  text: {
    color: color.gray4,
    marginBottom: 8,
    fontSize: 20
  },
  image: {
    ...margin(200, 0, 20, 0)
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
      return require('./assets/Spending.png')
    case emptyStateImage.map:
      return require('./assets/Map.png')
    case emptyStateImage.account:
      return require('./assets/Account.png')
  }
}

const LoginToView = (props) =>
  <View style={styles.container}>
    <Image style={styles.image} source={getImageSource(props.image)} />
    <DefaultText style={styles.text}>{props.lineOne}</DefaultText>
    <DefaultText style={styles.text}>{props.lineTwo}</DefaultText>
  </View>

export default LoginToView
