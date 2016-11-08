import React from 'react'
import {View} from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import styles from './BusinessListStyle'
import merge from '../../util/merge'

const BusinessListItem = props =>
  <View
    key={props.business.id}
    style={props.isSelected ? merge(styles.listItem.container, styles.listItem.containerSelected) : styles.listItem.container}>
    <View
      style={props.isSelected ? merge(styles.listItem.status, styles.listItem.statusSelected) : styles.listItem.status}/>
    <View style={styles.listItem.contents}>
      <ProfileImage
        img={props.business.image}
        style={styles.listItem.image}
        category={props.business.category}/>
      <View style={styles.listItem.verticalStack}>
        <DefaultText style={styles.listItem.title}>
          {props.business.display}
        </DefaultText>
        <DefaultText style={styles.listItem.shortDisplay}>
          {props.business.shortDisplay}
        </DefaultText>
      </View>
    </View>
  </View>

export default BusinessListItem
