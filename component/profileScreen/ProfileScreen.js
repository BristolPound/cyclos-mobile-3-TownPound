import React from 'react'
import { View, Image, TouchableHighlight } from 'react-native'
import DefaultText from '../DefaultText'
import TransactionList from './TransactionList'
import ProfileImage from '../profileImage/ProfileImage'
import color from '../../util/colors'
import styles from './ProfileStyle'

const ProfileScreen = (props) =>
  <TransactionList
      renderHeader={renderHeader(props)}
      dataSource={props.dataSource} />

const renderHeader = props => () =>
  <View style={styles.flex}>
    <View style={styles.flex}>
      <Image source={require('./gorilla.png')} style={styles.header.backgroundImage} />
        { props.isTabItem
          ? <View style={styles.header.topSpace} />
          : renderCloseExpandIcons(props)}
      <ProfileImage
        img={props.image}
        style={styles.header.businessLogo}
        category={props.category}/>
      <DefaultText style={styles.header.title}>{props.name}</DefaultText>
      <DefaultText style={styles.header.subtitle}>{props.username}</DefaultText>
    </View>
    {props.renderHeaderExtension()}
  </View>

const renderCloseExpandIcons = (props) =>
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

export default ProfileScreen
