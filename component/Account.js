import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TouchableHighlight, ListView } from 'react-native'

import DefaultText from '../DefaultText'
import { logout } from '../../store/reducer/login'
import merge from '../../util/merge'
import color from '../../util/colors'
import ProfileScreen from '../profileScreen/ProfileScreen'
import * as actions from '../../store/reducer/developerOptions'
import { onPressChangeServer } from '../DeveloperOptions'

const styles = {
  rowContainer: {
    flexDirection: 'row',
    margin: 14,
  },
  rowText: {
    marginHorizontal: 6
  }
}

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
      }],
    'Developer Options': [{
        text: 'Using: ' + (props.usingProdServer ? 'Prod' : 'Dev') + ' server',
        onPress: onPressChangeServer(props)
      }, {
        text: 'Clear Business State',
        onPress: () => props.clearBusinesses(),
        disabled: props.reloadingBusinesses,
      }, {
        text: 'Clear Spending State',
        onPress: () => props.clearTransactions(true),
        disabled: props.reloadingTransactions,
      }]
  }, ['Profile Settings', 'Developer Options'])

  return (
      <ProfileScreen
        isTabItem={true}
        loaded={!props.loadingDetails}
        image={props.details.image}
        category={'person'}
        defaultImage={!Boolean(props.details.image)}
        name={props.details.display}
        username={props.details.shortDisplay}
        renderHeaderExtension={() => null}
        dataSource={ds}
        renderRow={(accountOption, i) => <AccountOption {...accountOption} index={i}/> }
        />
  )
}

export const AccountOption = ({text, secondaryText, onPress, index, disabled}) =>
  <TouchableHighlight
      onPress={() => onPress && !disabled ? onPress() : undefined}
      key={index}
      underlayColor={color.transparent}>
    <View style={styles.rowContainer}>
      <DefaultText style={merge(styles.rowText, { flex: 1 }, disabled ? {color: 'orange'}: {})}>{text}</DefaultText>
      { secondaryText
        ? <DefaultText style={merge(styles.rowText, { flex: 0 })}>{secondaryText}</DefaultText>
        : undefined }
    </View>
  </TouchableHighlight>

const mapStateToProps = state => {
  return state.account
}

const mapDispatchToProps = dispatch => bindActionCreators({ logout, ...actions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Account)
