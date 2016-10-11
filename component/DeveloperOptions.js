import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ListView } from 'react-native'

import * as actions from '../store/reducer/developerOptions'
import { logout } from '../store/reducer/login'
import { AccountOption } from './meScreen/Account'

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
        text: 'Clear Business State',
        onPress: () => props.clearBusinesses(),
        disabled: props.reloadingBusinesses,
      }, {
        text: 'Clear Spending State',
        onPress: () => props.clearTransactions(true),
        disabled: props.reloadingTransactions,
      }
    ]
  }, ['Developer Options'])

  return <ListView
    dataSource={ds}
    renderRow={(accountOption, i) => <AccountOption {...accountOption} index={i}/> }
    />
}

export const onPressChangeServer = props => () => {
  props.switchBaseUrl()
  if (props.loggedIn) {
    props.logout()
  }
}

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  reloadingBusinesses: state.business.refreshing,
  reloadingTransactions: state.transaction.loadingTransactions,
  usingProdServer: state.developerOptions.prodServer
})

const mapDispatchToProps = dispatch => bindActionCreators({
    ...actions,
    logout
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperOptions)
