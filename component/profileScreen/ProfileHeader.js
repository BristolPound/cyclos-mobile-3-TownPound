import React from 'react'
import { View, Image, TouchableHighlight } from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import color from '../../util/colors'
import styles from './ProfileStyle'
import commonStyle from '../style'

// TODO: There is a strong overlap here with the `Header` component in Account.js
const ProfileHeader = (props) =>
  <View style={styles.flex}>
    <Image source={require('./gorilla.png')}
      style={commonStyle.header.backgroundImage}
      resizeMode={'cover'} />
      {renderCloseIcon(props)}
    <ProfileImage
      img={props.image}
      style={styles.header.businessLogo}
      category={props.category}/>
    <DefaultText style={styles.header.title}>{props.name}</DefaultText>
    <DefaultText style={styles.header.subtitle}>{props.username}</DefaultText>
  </View>

const renderCloseIcon = (props) =>
  <View style={styles.rowLayout}>
    <TouchableHighlight style={styles.header.closeButton}
      onPress={props.onPressClose}
      underlayColor={color.white}>
      <Image
        style={styles.header.closeIcon}
        source={require('./Close.png')}
      />
    </TouchableHighlight>
  </View>

export default ProfileHeader
