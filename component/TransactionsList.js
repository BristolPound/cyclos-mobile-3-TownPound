import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StyleSheet, ListView, View, Image, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native'

import DefaultText from './DefaultText'
import Price from './Price'
import merge from '../util/merge'
import { findTransactionsByDate } from '../util/transaction'
import TransactionHeader from './TransactionHeader'
import * as actions from '../store/reducer/transaction'
import { openDetailsModal } from '../store/reducer/navigation'

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
    <Price price={transaction.amount}/>
  </View>
  </TouchableHighlight>

const renderLoadingFooter = () =>
  <View style={merge(styles.section, styles.sectionBorder, {justifyContent: 'center'})}>
    <ActivityIndicator/>
  </View>

const TransactionsList = (props) =>
  <View style={{flex:1}}>
    <TransactionHeader />
    {props.loadingTransactions
      ? <ActivityIndicator size='large' style={{flex: 1}}/>
      : <ListView
          style={{flex: 1}}
          pageSize={10}
          dataSource={props.dataSource}
          renderSeparator={renderSeparator}
          renderSectionHeader={renderSectionHeader}
          renderFooter={() =>
              ( props.loadingMoreTransactions
                ? renderLoadingFooter()
                : undefined)}
          renderRow={transaction => renderRow(transaction, props.openDetailsModal)}
          refreshControl={<RefreshControl
            refreshing={props.refreshing}
            onRefresh={() => !props.refreshing && props.transactions.length > 0
              ? props.loadTransactionsAfter(props.transactions[0].date, findTransactionsByDate(props.transactions, props.transactions[0].date))
              : undefined} />
          }/>}
  </View>


const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, openDetailsModal: openDetailsModal }, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsList)
