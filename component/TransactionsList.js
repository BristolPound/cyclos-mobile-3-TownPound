import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StyleSheet, ListView, View, Image, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import DefaultText from './DefaultText'
import Price from './Price'
import merge from '../util/merge'
import color from '../util/colors'
import { findTransactionsByDate } from '../util/transaction'
import TransactionHeader from './TransactionHeader'
import * as actions from '../store/reducer/transaction'
import { openDetailsModal, navigateToTransactionTab } from '../store/reducer/navigation'

const borderColor = '#ddd'
const marginSize = 8

const styles = {
  image: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 10,
    borderColor: borderColor,
    borderWidth: 1
  },
  rowContainer: {
    flexDirection: 'row',
    margin: marginSize,
    alignItems: 'center'
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
    fontWeight: 'bold',
    marginLeft: 8,
    alignSelf:'center'
  }
}

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={merge(styles.section, styles.sectionBorder)} key={sectionID}>
   <DefaultText style={styles.sectionHeader}>
     {sectionID}
   </DefaultText>
  </View>

const renderRow = (transaction, openDetailsModal) =>
  <TouchableHighlight
      onPress={() => transaction.relatedAccount.user && openDetailsModal(transaction.relatedAccount.user)}
      key={transaction.transactionNumber}>
    <View style={styles.rowContainer}>
      { transaction.relatedAccount.user && transaction.relatedAccount.user.image
        ? <Image style={styles.image} source={{uri: transaction.relatedAccount.user.image.url}}/>
      : <View style={styles.image} /> }
      { transaction.relatedAccount.user
        ? <DefaultText style={{marginLeft: 10}}>{transaction.relatedAccount.user.display}</DefaultText>
      : <DefaultText style={{marginLeft: 10}}>'System'</DefaultText> }
    <Price price={transaction.amount} style={{flex: 1}}/>
  </View>
  </TouchableHighlight>

const renderLoadingFooter = () =>
  <View style={merge(styles.section, styles.sectionBorder, {justifyContent: 'center'})}>
    <ActivityIndicator/>
  </View>

const standardListViewProps = {
  style: {flex: 1},
  pageSize: 10,
  renderSeparator: renderSeparator,
  enableEmptySections: true,
}

const TransactionsList = (props) =>
  <View style={{flex:1}}>
    <TransactionHeader />
    {props.loadingTransactions
      ? <ActivityIndicator size='large' style={{flex: 1}}/>
      : (<ScrollableTabView
            initialPage={props.transactionTabIndex}
            tabBarActiveTextColor={color.bristolBlue}
            tabBarBackgroundColor={color.lightGray}
            scrollWithoutAnimation={true}
            locked={true}
            onChangeTab={({i}) => props.navigateToTransactionTab(i)}
            tabBarUnderlineColor={color.bristolBlue}>
          <ListView
            tabLabel='Transactions'
            {...standardListViewProps}
            dataSource={props.transactionsDataSource}
            renderSectionHeader={renderSectionHeader}
            renderRow={transaction => renderRow(transaction, props.openDetailsModal)}
            renderFooter={() =>
                ( props.loadingMoreTransactions
                  ? renderLoadingFooter()
                  : undefined)}
            refreshControl={<RefreshControl
              refreshing={props.refreshing}
            onRefresh={() => !props.refreshing && props.transactions.length > 0
              ? props.loadTransactionsAfter(props.transactions[0].date, findTransactionsByDate(props.transactions, props.transactions[0].date))
                : undefined} />
            }/>
          <ListView
            tabLabel='Traders & Friends'
            {...standardListViewProps}
            dataSource={props.traderDataSource}
            renderRow={transaction => renderRow(transaction, props.openDetailsModal)}
            renderFooter={() =>
                ( props.loadingMoreTransactions
                  ? renderLoadingFooter()
                  : undefined)}
            refreshControl={<RefreshControl
              refreshing={props.refreshing}
              onRefresh={() => !props.refreshing && props.transactions && props.transactions.length > 0
                ? props.loadTransactionsAfter(props.transactions[0].date, findTransactionsByDate(props.transactions, props.transactions[0].date))
                : undefined} />
            }/>
        </ScrollableTabView>)}
  </View>


const mapDispatchToProps = (dispatch) =>
  bindActionCreators({...actions, navigateToTransactionTab: navigateToTransactionTab, openDetailsModal: openDetailsModal}, dispatch)

const mapStateToProps = (state) => ({...state.transaction, transactionTabIndex: state.navigation.transactionTabIndex})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsList)
