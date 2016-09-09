import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StyleSheet, ListView, View, Image, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native'

import DefaultText from './DefaultText'
import Price from './Price'
import merge from '../util/merge'
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

const renderFooter = (onPress) =>
  <TouchableHighlight onPress={onPress}>
    <View style={merge(styles.section, styles.sectionBorder)}>
      <DefaultText style={merge(styles.sectionHeader, {color: '#1480ba'})}>Load more ...</DefaultText>
    </View>
  </TouchableHighlight>

const loadTransactions = (dispatchedFunction, useFirstDate, transactions) => {
  if (transactions.length > 0) {
    const transactionDate = transactions[useFirstDate ? 0 : transactions.length - 1].date
    //TODO: optimise as we know the list is sorted and the date is at the end of the list
    const excludeIdList = transactions
                            .filter((tr) => tr.date === transactionDate)
                            .map((tr) => tr.id)
    dispatchedFunction(transactionDate, excludeIdList)
  }
}

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
              props.noMoreTransactionsToLoad
              ? undefined
              : ( props.loadingMoreTransactions
                ? renderLoadingFooter()
                : renderFooter(() => loadTransactions(props.loadTransactionsBefore, false, props.transactions)))}
          renderRow={transaction => renderRow(transaction, props.openDetailsModal)}
          refreshControl={<RefreshControl
            refreshing={props.refreshing}
            onRefresh={() => loadTransactions(props.loadTransactionsAfter, true, props.transactions)} />
          }/>}
  </View>


const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, openDetailsModal: openDetailsModal }, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsList)
