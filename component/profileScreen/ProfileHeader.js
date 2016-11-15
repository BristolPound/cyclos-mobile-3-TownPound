import React from 'react'
import { View, Image, TouchableHighlight } from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import color from '../../util/colors'
import styles from './ProfileStyle'

// TODO: There is a strong overlap here with the `Header` component in Account.js
const ProfileHeader = (props) =>
  <View style={styles.flex}>
    <Image source={require('./gorilla.png')} style={styles.header.backgroundImage} />
    { props.isTabItem // TODO: No reference in the code to this.
      ? <View style={styles.header.topSpace} />
      : renderCloseIcon(props)}
    <ProfileImage
      img={props.image}
      style={styles.header.businessLogo}
      category={props.category}/>
    <DefaultText style={styles.header.title}>{props.name}</DefaultText>
    <DefaultText style={styles.header.subtitle}>{props.username}</DefaultText>
  </View>

const renderCloseIcon = (props) =>
  <View style={styles.rowLayout}>
    <TouchableHighlight
      onPress={props.onPressClose}
      underlayColor={color.white}>
      <Image
        style={styles.header.closeIcon}
        source={require('./Close.png')}
      />
    </TouchableHighlight>
  </View>

export default ProfileHeader