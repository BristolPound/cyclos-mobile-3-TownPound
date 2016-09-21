import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ListView } from 'react-native'

import { DisplayAccountOptions } from './Account'
import { switchBaseUrl, clearStoredBusinesses, clearStoredTransactions } from '../store/reducer/developerOptions'
import { logout } from '../store/reducer/login'

const onPressChangeServer = props => () => {
  props.switchBaseUrl()
  if (props.loggedIn) {
    props.logout()
  }
}

const DeveloperOptions = props => {
  let ds = new ListView.DataSource({
    rowHasChanged: (a, b) => a.text !== b.text || a.disabled !== b.disabled,
    sectionHeaderHasChanged: (a, b) => a !== b
  })

  ds = ds.cloneWithRowsAndSections({
    'Developer Options': [{
        text: 'Using: ' + (props.usingProdServer ? 'Prod' : 'Dev') + ' server',
        onPress: onPressChangeServer(props)
      }, {
        text: 'Clear Search Business Cache',
        onPress: props.clearStoredBusinesses,
        disabled: props.reloadingBusinesses,
      }, {
        text: 'Clear Spending Transaction Cache',
        onPress: props.clearStoredTransactions,
        disabled: props.reloadingTransactions,
      } ]
  }, ['Developer Options'])

  return (
    <View style={{flex: 0}}>
      <DisplayAccountOptions datasource={ds} />
    </View>
  )
}

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  reloadingBusinesses: state.business.refreshing,
  reloadingTransactions: state.transaction.loadingTransactions,
  usingProdServer: state.developerOptions.prodServer
})

const mapDispatchToProps = dispatch => bindActionCreators({
    logout,
    switchBaseUrl,
    clearStoredBusinesses,
    clearStoredTransactions
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperOptions)
