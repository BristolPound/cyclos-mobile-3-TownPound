import React from 'react'
import { ScrollView, View, StatusBar, Modal, Image } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import Business from './Business'
import TransactionsList from './TransactionsList'
import SendMoney from './SendMoney'
import color from '../util/colors'
import { connect } from 'react-redux'

const Tabs = (props) =>
  <View style={{backgroundColor: color.bristolBlue, flex: 1}}>
    <StatusBar barStyle='light-content'/>
    <ScrollableTabView
        tabBarPosition='bottom'
        tabBarActiveTextColor={color.bristolBlue}
        style={{marginTop: 20, flex: 1, backgroundColor: 'white'}}
        tabBarBackgroundColor={color.lightGray}
        scrollWithoutAnimation={true}
        locked={true}
        tabBarUnderlineColor={color.transparent}>
      <Business tabLabel='Directory'/>
      <TransactionsList tabLabel='Transactions'/>
      <SendMoney tabLabel='Send Money'/>
    </ScrollableTabView>
  </View>

export default Tabs
