import React from 'react'
import { View, Image, TouchableHighlight } from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import color from '../../util/colors'
import styles from './ProfileStyle'

const ProfileHeader = (props) =>
  <View style={styles.header.container}>
    <Image source={require('./gorillaWithBackground.png')}
      style={styles.header.backgroundImage}
      resizeMode='cover' />
    {props.isModal ? renderCloseIcon(props) : undefined}
    <View style={styles.header.center}>
      <ProfileImage
        image={props.image}
        style={styles.header.businessLogo}
        category={props.category}
        colorCode={0} />
      <DefaultText style={styles.header.title}>{props.name}</DefaultText>
      <DefaultText style={styles.header.subtitle}>{props.username}</DefaultText>
    </View>
  </View>

const renderCloseIcon = (props) =>
    <TouchableHighlight style={styles.header.closeButton}
      onPress={props.onPressClose}
      underlayColor={color.transparent}>
      <Image
        style={styles.header.closeIcon}
        source={require('./Close_Blue.png')}
      />
    </TouchableHighlight>

export default ProfileHeader
