import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ListView, View, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native'
import ProfileImage from '../profileImage/ProfileImage'
import TransactionHeader from './TransactionHeader'
import DefaultText from '../DefaultText'
import Price from '../Price'
import merge from '../../util/merge'
import color from '../../util/colors'
import * as actions from '../../store/reducer/transaction'
import { openDetailsModal, navigateToTransactionTab } from '../../store/reducer/navigation'
import moment from 'moment'

import styles from './TransactionStyle'

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={styles.sectionHeader.container} key={sectionID}>
    <DefaultText style={styles.sectionHeader.text}>
      {moment(sectionData[0].date).format('D MMMM YYYY').toUpperCase()}
    </DefaultText>
  </View>

const getTransactionImage = (transaction) =>
  transaction.relatedAccount.user && transaction.relatedAccount.user.image
    ? transaction.relatedAccount.user.image
    : undefined

const renderRow = (transaction, openDetailsModal) =>
  <TouchableHighlight
      onPress={() => transaction.relatedAccount.user && openDetailsModal(transaction.relatedAccount.user.id)}
      underlayColor={color.transparent}
      key={transaction.transactionNumber}>
    <View style={styles.row.container}>
      <ProfileImage
        img={getTransactionImage(transaction)}
        style={styles.row.image}
        category='shop'/>
      <View style={styles.row.textContainer}>
        <DefaultText style={styles.row.text}>
          { transaction.relatedAccount.user ? transaction.relatedAccount.user.display : 'System' }
        </DefaultText>
        <Price price={transaction.amount} style={styles.row.price} size={22}/>
      </View>
    </View>
  </TouchableHighlight>

const TransactionList = (props) => {
  let bodyComponent
  if (props.loadingTransactions) {
    bodyComponent = <ActivityIndicator size='large' style={styles.loadingIndicator}/>
  } else if (props.transactions.length > 0) {
    bodyComponent = <ListView
        tabLabel='Transactions'
        style={styles.transactionList}
        pageSize={10}
        renderSeparator={renderSeparator}
        enableEmptySections={true}
        renderRow={transaction => renderRow(transaction, props.openDetailsModal)}
        dataSource={props.transactionsDataSource}
        renderSectionHeader={renderSectionHeader}
        refreshControl={<RefreshControl
          refreshing={props.refreshing}
          onRefresh={() => !props.refreshing ? props.loadMoreTransactions() : undefined} />
        }/>
  } else {
    bodyComponent = <View style={styles.noTransactions.container}>
      <DefaultText style={styles.noTransactions.text}>You have made no transactions</DefaultText>
      <DefaultText style={styles.noTransactions.text}>this month</DefaultText>
    </View>
  }

  return <View style={styles.container}>
      {bodyComponent}
      <TransactionHeader />
    </View>
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    ...actions,
    navigateToTransactionTab: navigateToTransactionTab,
    openDetailsModal: openDetailsModal
  }, dispatch)

const mapStateToProps = (state) => ({
  ...state.transaction
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
