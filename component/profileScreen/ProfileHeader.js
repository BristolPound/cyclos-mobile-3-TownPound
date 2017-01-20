import React from 'react'
import { View, Image } from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import styles from './ProfileStyle'
import merge from '../../util/merge'

import  { CloseButton } from '../common/CloseButton'

const CLOSE_BUTTON = require('./../common/assets/Close_Blue.png')

const renderCloseButton = (onPress) =>
  <CloseButton style={styles.header.closeButton} onPress={onPress} closeButtonType={CLOSE_BUTTON} size={70}/>

const background = () =>
  <Image source={require('./assets/gorillaWithBackground.png')}
      style={styles.header.backgroundImage}
      resizeMode='cover' />

const ProfileHeader = (props) => {
  getBackground = () => {
    return props.paymentComplete ? undefined  : background()
  }

  getSubtitleStyle = () => {
    return props.paymentComplete ? styles.header.subtitle : merge(styles.header.subtitle, {marginBottom: 46})
  }

  return (
      <View>
          { this.getBackground() }
          { props.isModal ? renderCloseButton(props.onPressClose) : undefined }
        <View style={styles.header.center}>
          <ProfileImage
            image={props.image && {uri: props.image.url}}
            style={styles.header.businessLogo}
            category={props.category}
            colorCode={0} />
          <DefaultText style={styles.header.title}>{props.name}</DefaultText>
          <DefaultText style={this.getSubtitleStyle()}>{props.username}</DefaultText>
        </View>
      </View>
  )
}

export default ProfileHeader
