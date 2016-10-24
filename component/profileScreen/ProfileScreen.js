import React from 'react'
import { View, Image, TouchableHighlight, ListView, Dimensions } from 'react-native'
import DefaultText from '../DefaultText'
import Price from '../Price'
import merge from '../../util/merge'
import ProfileImage from '../profileImage/ProfileImage'
import {format} from '../../util/date'
import color from '../../util/colors'
import styles from './ProfileStyle'

const buttonHeight= 60

const ProfileScreen = (props) =>
  <ListView
      style= {{flex: 0, maxHeight: Dimensions.get('window').height - buttonHeight}}
      renderHeader={renderHeader(props)}
      dataSource={props.dataSource}
      renderRow={props.renderRow || renderRow}
      renderSeparator={renderSeparator}
      renderSectionHeader={renderSectionHeader}/>

const renderHeader = props => () =>
  <View style={styles.flex}>
    <View style={styles.dropshadow}>
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

const renderRow = (transaction) =>
  <View style={styles.list.rowContainer} key={transaction.transactionNumber}>
    <View style={styles.rowLayout}>
      <DefaultText style={styles.list.date}>{format(transaction.date, 'DD MMMM')}</DefaultText>
      <DefaultText style={styles.list.transactionNumber}>{transaction.transactionNumber}</DefaultText>
      <Price
        style={styles.list.price}
        size={20}
        smallFontSize={16}
        price={transaction.amount}/>
    </View>
  </View>

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.list.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={merge(styles.list.sectionHeader, styles.list.sectionBorder)} key={sectionID}>
   <DefaultText style={styles.list.sectionHeaderText}>
     {sectionID}
   </DefaultText>
  </View>


export default ProfileScreen
