import React from 'react'
import { View, Image } from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import styles from './ProfileStyle'

import  { CloseButton } from '../common/CloseButton'

const CLOSE_BUTTON = require('./../common/assets/Close_Blue.png')

const ProfileHeader = (props) =>
  <View style={styles.header.container}>
    <Image source={require('./assets/gorillaWithBackground.png')}
      style={styles.header.backgroundImage}
      resizeMode='cover' />
      { props.isModal ? <CloseButton onPress={props.onPressClose} closeButtonType={CLOSE_BUTTON} /> : undefined }
    <View style={styles.header.center}>
      <ProfileImage
        image={props.image && {uri: props.image.url}}
        style={styles.header.businessLogo}
        category={props.category}
        colorCode={0} />
      <DefaultText style={styles.header.title}>{props.name}</DefaultText>
      <DefaultText style={styles.header.subtitle}>{props.username}</DefaultText>
    </View>
  </View>


export default ProfileHeader
