import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ListView, View, TouchableHighlight, Image } from 'react-native'
import color from '../util/colors'
import merge from '../util/merge'
import { loadBusinessList, resetBusinesses } from '../store/reducer/business'
import { loadTransactions, resetTransactions } from '../store/reducer/transaction'
import DefaultText from './DefaultText'
import { showModal } from '../store/reducer/navigation'
import modalState from '../store/reducer/modalState'
import LOGIN_STATUSES from '../stringConstants/loginStatus'
import { selectServer, SERVER } from '../store/reducer/developerOptions'

const FONT_SIZE = 14
const PADDING = 5

const style = {
  header: {
    container: {
      padding: PADDING,
      backgroundColor: color.gray4
    },
    text: {
      fontSize: FONT_SIZE
    }
  },
  row: {
    container: {
      padding: PADDING
    },
    text: {
      fontSize: FONT_SIZE
    }
  }
}

const DeveloperOption = ({text, onPress, disabled, index}) =>
  <View key={index} style={style.row.container}>
    <TouchableHighlight
        onPress={() => !disabled && onPress()}
        underlayColor={color.transparent}>
      <View>
        <DefaultText style={merge(style.row.text, disabled ? {opacity: 0.5} : {})}>
          {text}
        </DefaultText>
      </View>
    </TouchableHighlight>
  </View>

const renderSectionHeader = (sectionData, sectionID) =>
  <View key={sectionID} style={style.header.container}>
    <DefaultText style={style.row.text}>{sectionID}</DefaultText>
  </View>

const DeveloperOptions = props => {
  let ds = new ListView.DataSource({
    rowHasChanged: (a, b) => a.text !== b.text || a.disabled !== b.disabled,
    sectionHeaderHasChanged: (a, b) => a !== b
  })

  const rows = {
    'App State': [
      { text: `Businesses: ${props.store.businessCount}` },
      { text: `Business List Timestamp: ${props.store.businessTimestamp}` },
      { text: `Transactions: ${props.store.transactionCount}` },
      { text: `Server: ${props.store.server}` },
    ],
    'Developer Actions': [{
        text: 'Clear All Business Data',
        onPress: () => props.resetBusinesses()
      },
      {
        text: 'Load Business Data',
        onPress: () => props.loadBusinessList()
      },
      {
        text: 'Clear All Transaction Data',
        onPress: () => props.resetTransactions(),
        disabled: props.loadingTransactions
      },
      {
        text: 'Load Transaction Data',
        onPress: () => props.loadTransactions(),
        disabled: props.loadingTransactions || !props.loggedIn
      },
      {
        text: 'Switch Server To ' +
          (props.store.server === SERVER.STAGE ? 'Dev' : 'Stage'),
        onPress: () => props.selectServer(props.store.server === SERVER.STAGE ? 'DEV' : 'STAGE')
      }
    ]
  }

  ds = ds.cloneWithRowsAndSections(rows, Object.keys(rows))

  return (
    <View style={{flex: 1}}>
      <View>
        <TouchableHighlight
            onPress={() => props.showModal(modalState.none)}
            underlayColor={color.white}>
          <Image source={require('./profileScreen/Close.png')} style={{margin: 20}}/>
        </TouchableHighlight>
      </View>
      <ListView
        style={{flex: 1}}
        dataSource={ds}
        renderRow={(accountOption, i) => <DeveloperOption {...accountOption} index={i}/> }
        renderSectionHeader={renderSectionHeader}
        accessibilityLabel='Developer Options'/>
    </View>
  )
}

export const onPressChangeServer = props => () => {
  props.switchBaseUrl()
  if (props.loggedIn) {
    props.logout()
  }
}

const mapStateToProps = state => ({
  store: {
    businessCount: state.business.businessList.length,
    businessTimestamp: state.business.businessListTimestamp,
    transactionCount: state.transaction.transactions.length,
    server: state.developerOptions.server
  },
  loadingTransactions: state.transaction.loadingTransactions,
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN
})

const mapDispatchToProps = dispatch => bindActionCreators({
    loadTransactions,
    resetTransactions,
    resetBusinesses,
    loadBusinessList,
    showModal,
    selectServer
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperOptions)
