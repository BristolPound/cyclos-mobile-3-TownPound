import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ActivityIndicator, TouchableHighlight, StyleSheet, ListView, Image } from 'react-native'

import DefaultText from './DefaultText'
import DeveloperOptions from './DeveloperOptions'
import { logout } from '../store/reducer/login'
import merge from '../util/merge'
import color from '../util/colors'

const headerHeight = 300
const borderColor = '#ddd'
const marginSize = 8
const horizontalMargin = 10
const styles = {
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    resizeMode: 'cover',
    height: headerHeight
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: color.lightGray,
    borderRadius: 10,
    borderColor: borderColor,
    borderWidth: 1,
    alignSelf: 'center'
  },
  headerDetail: {
    alignSelf: 'center'
  },
  imageVisible: {
    backgroundColor: 'transparent'
  },
  rowContainer: {
    flexDirection: 'row',
    margin: marginSize,
  },
  rowText: {
    marginHorizontal: horizontalMargin
  },
  sectionBorder: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: borderColor,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  section: {
    height: 40,
    backgroundColor: '#efefef',
    flexDirection: 'row'
  },
  separator: {
    marginLeft: marginSize,
    marginRight: marginSize,
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  sectionHeader: {
    fontSize: 15,
    marginLeft: horizontalMargin,
    alignSelf:'center'
  },
  disabledButton: {
    color: 'orange',
  }
}

const AccountHeader = ({image, display, shortDisplay}) =>
  <View style={{height: headerHeight}}>
    <Image source={require('../../img/Artboard.png')} style={styles.backgroundImage} />
    <View style={{top: (headerHeight / 3), alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
      { image
        ? <Image style={merge(styles.image, styles.imageVisible)} source={{uri: image.url}}/>
        : <View style={styles.image}/> }
      <DefaultText style={styles.headerDetail}>{display}</DefaultText>
      <DefaultText style={styles.headerDetail}>@{shortDisplay}</DefaultText>
    </View>
  </View>

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={merge(styles.section, styles.sectionBorder)} key={sectionID}>
   <DefaultText style={styles.sectionHeader}>
     {sectionID.toUpperCase()}
   </DefaultText>
  </View>

const AccountOption = ({text, secondaryText, onPress, index, disabled}) =>
  <TouchableHighlight
      onPress={() => onPress && !disabled ? onPress() : undefined}
      key={index}
      underlayColor={color.transparent}>
    <View style={styles.rowContainer}>
      <DefaultText style={merge(styles.rowText, { flex: 1 }, disabled ? styles.disabledButton : {})}>{text}</DefaultText>
      { secondaryText
        ? <DefaultText style={merge(styles.rowText, { flex: 0 })}>{secondaryText}</DefaultText>
        : undefined }
    </View>
  </TouchableHighlight>

export const DisplayAccountOptions = ({datasource}) =>
  <ListView
      style={{flex: 0}}
      renderSeparator={renderSeparator}
      dataSource={datasource}
      renderSectionHeader={renderSectionHeader}
      renderRow={(accountOption, i) => <AccountOption {...accountOption} index={i}/> } />

const Account = props => {
  let ds = new ListView.DataSource({
    rowHasChanged: (a, b) => a.text !== b.text || a.secondaryText !== b.secondaryText,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
  ds = ds.cloneWithRowsAndSections({
    'Profile Settings': [{
        text: 'Email',
        secondaryText: (props.details && props.details.email) || 'Not set'
      }, {
        text: 'Phone',
        secondaryText: (props.details && props.details.phones && props.details.phones.length > 0) ? props.details.phones[0].normalizedNumber : 'Not set'
      }, {
        text: 'Log out',
        onPress: props.logout
      }]
  }, ['Profile Settings'])

  return <View style={{flex: 1}}>
    { props.loadingDetails
      ? <ActivityIndicator size='large' style={{flex: 1, backgroundColor: 'transparent'}}/>
      : <View style={{flex: 1}}>
          <AccountHeader {...props.details}/>
          <DisplayAccountOptions datasource={ds} />
          <DeveloperOptions />
      </View>}
  </View>
}

const mapStateToProps = state => state.account

const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Account)
