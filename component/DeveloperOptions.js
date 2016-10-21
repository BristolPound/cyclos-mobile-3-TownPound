import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ListView } from 'react-native'

import * as actions from '../store/reducer/developerOptions'
import { logout } from '../store/reducer/login'
import { AccountOption } from './Account'
import LOGIN_STATUSES from '../stringConstants/loginStatus'

const DeveloperOptions = props => {
  let ds = new ListView.DataSource({
    rowHasChanged: (a, b) => a.text !== b.text || a.disabled !== b.disabled,
    sectionHeaderHasChanged: (a, b) => a !== b
  })

  ds = ds.cloneWithRowsAndSections({
    'Developer Options': [{
        text: 'Using: ' + (props.usingProdServer ? 'Prod' : 'Dev') + ' server',
        onPress: onPressChangeServer(props),
        accessibilityLabel: 'Using Server Option',
      }, {
        text: 'Clear Business State',
        onPress: () => props.clearBusinesses(),
        disabled: props.reloadingBusinesses,
        accessibilityLabel: 'Clear Businesses Option',
      }, {
        text: 'Clear Spending State',
        onPress: () => props.clearTransactions(true),
        disabled: props.reloadingTransactions,
        accessibilityLabel: 'Clear Spending Option',
      }
    ]
  }, ['Developer Options'])

  return <ListView
    dataSource={ds}
    renderRow={(accountOption, i) => <AccountOption {...accountOption} index={i}/> }
    accessibilityLabel='Developer Options'
    />
}

export const onPressChangeServer = props => () => {
  props.switchBaseUrl()
  if (props.loggedIn) {
    props.logout()
  }
}

const mapStateToProps = state => ({
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN,
  reloadingBusinesses: state.business.refreshing,
  reloadingTransactions: state.transaction.loadingTransactions,
  usingProdServer: state.developerOptions.prodServer
})

const mapDispatchToProps = dispatch => bindActionCreators({
    ...actions,
    logout
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperOptions)
