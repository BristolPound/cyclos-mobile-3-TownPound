import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, StyleSheet, ListView, TouchableHighlight } from 'react-native'
import DefaultText, { baselineDeltaForFonts } from './DefaultText'
import colors from './../util/colors'
import commonStyle from './style'
import * as actions from '../store/reducer/login'
import { updateStatus } from '../store/reducer/statusMessage'
import { isScreenSmall } from '../util/ScreenSizes'
import ProfileHeader from './profileScreen/ProfileHeader'

const styles = {
  container: {
    flex: 1
  },
  detailsList: {
    flex: 1,
    ...commonStyle.shadow,
    backgroundColor: colors.offWhite
  },
  sectionHeader: commonStyle.sectionHeader,
  row: {
    container: {
      height: isScreenSmall ? 40 : 42,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 14,
      paddingRight: 14,
      backgroundColor: colors.white
    },
    label: {
      fontSize: 16,
      color: colors.offBlack,
      fontFamily: commonStyle.font.museo500,
      flex: 1
    },
    secondary: {
      flex: 0,
      // the delta required to align this with the label (which has a larger font size)
      marginBottom: baselineDeltaForFonts(16, 14),
      fontSize: 14,
      color: colors.gray2,
      fontFamily: commonStyle.font.museo300
    }
  },
  separator: {
    borderBottomColor: colors.gray5,
    borderBottomWidth: 1
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
}

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={styles.sectionHeader.container} key={sectionID}>
    <DefaultText style={styles.sectionHeader.text}>
      {sectionID.toUpperCase()}
    </DefaultText>
  </View>

const AccountOption = ({text, secondaryText, onPress, index}) =>
  <TouchableHighlight
      onPress={() => onPress ? onPress() : undefined}
      key={index}
      underlayColor={onPress ? colors.gray5 : colors.transparent}>
    <View style={styles.row.container}>
      <DefaultText style={styles.row.label}>{text}</DefaultText>
      { secondaryText
        ? <DefaultText style={styles.row.secondary}>{secondaryText}</DefaultText>
        : undefined }
    </View>
  </TouchableHighlight>

const Account = (props) => {
  let ds = new ListView.DataSource({
    rowHasChanged: (a, b) => a.text !== b.text || a.secondaryText !== b.secondaryText,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
  const data = {
    'Profile Settings': [{
        text: 'Email',
        secondaryText: (props.details && props.details.email) || 'Not set'
      }, {
        text: 'Phone',
        secondaryText: (props.details && props.details.phones && props.details.phones.length > 0) ? props.details.phones[0].normalizedNumber : 'Not set'
      }, {
        text: 'Log out',
        onPress: () => {
          props.logout()
          props.updateStatus('Logged out ✓')
        }
      }]
  }
  ds = ds.cloneWithRowsAndSections(data, Object.keys(data))

  return (
    <View style={styles.container}>
      <ProfileHeader
        name={props.details.display}
        username={props.details.shortDisplay}
        image={props.details.image}
        category='person'/>
      <ListView
        style={styles.detailsList}
        dataSource={ds}
        scrollEnabled={false}
        renderSeparator={renderSeparator}
        renderSectionHeader={renderSectionHeader}
        renderRow={(accountOption, i) => <AccountOption {...accountOption} index={i}/> }/>
    </View>
  )
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, updateStatus }, dispatch)

const mapStateToProps = state =>  state.account

export default connect(mapStateToProps, mapDispatchToProps)(Account)
