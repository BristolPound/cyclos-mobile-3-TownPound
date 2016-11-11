import React from 'react'
import { View } from 'react-native'
import TransactionList from './TransactionList'
import ProfileHeader from './ProfileHeader'
import styles from './ProfileStyle'

const ProfileScreen = (props) =>
  <TransactionList
      renderHeader={renderHeader(props)}
      dataSource={props.dataSource} />

const renderHeader = props => () =>
  <View style={styles.flex}>
    <ProfileHeader
      name={props.name}
      username={props.username}
      image={props.image}
      category={props.category}
      onPressClose={props.onPressClose}
      isTabItem={props.isTabItem}
    />
    {props.renderHeaderExtension()}
  </View>

export default ProfileScreen
