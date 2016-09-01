import React from 'react'
import { View, StatusBar } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'

import Business from './Business'
import TransactionsList from './TransactionsList'
import SendMoney from './SendMoney'
import color from '../util/colors'

const Tabs = (props) =>
  <View style={{backgroundColor: color.bristolBlue, flex: 1}}>
    <StatusBar barStyle='light-content'/>
    <ScrollableTabView
        tabBarPosition='bottom'
        initialPage={props.tabIndex}
        tabBarActiveTextColor={color.bristolBlue}
        style={{marginTop: 20, flex: 1, backgroundColor: 'white'}}
        tabBarBackgroundColor={color.lightGray}
        scrollWithoutAnimation={true}
        locked={true}
        onChangeTab={({i}) => props.navigateToTab(i)}
        tabBarUnderlineColor={color.transparent}>
      <Business tabLabel='Directory'/>
      <TransactionsList tabLabel='Transactions'/>
      <SendMoney tabLabel='Send Money'/>
    </ScrollableTabView>
  </View>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.navigation})

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
