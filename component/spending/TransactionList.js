import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ListView, View, Image, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native'

import TransactionHeader from './TransactionHeader'
import DefaultText from '../DefaultText'
import Price from '../Price'
import merge from '../../util/merge'
import color from '../../util/colors'
import * as actions from '../../store/reducer/transaction'
import { openDetailsModal, navigateToTransactionTab } from '../../store/reducer/navigation'

import styles from './TransactionStyle'

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={styles.headerContainer} key={sectionID}>
    <DefaultText style={styles.sectionHeader}>{sectionID}</DefaultText>
  </View>

const renderRow = (transaction, openDetailsModal) =>
  <TouchableHighlight
      onPress={() => transaction.relatedAccount.user && openDetailsModal(transaction.relatedAccount.user.id)}
      underlayColor={color.transparent}
      key={transaction.transactionNumber}>
    <View style={styles.rowContainer}>
      { transaction.relatedAccount.user && transaction.relatedAccount.user.image
        ? <Image
            style={merge(styles.image, styles.imageVisible)}
            source={{uri: transaction.relatedAccount.user.image.url}}/>
        : <View style={styles.image} /> }
      <View style={styles.textContainer}>
        <DefaultText style={merge(styles.flex, styles.text)}>
          { transaction.relatedAccount.user ? transaction.relatedAccount.user.display : 'System' }
        </DefaultText>
        <Price price={transaction.amount} style={styles.noflex} size={22} smallSize={16} />
      </View>
    </View>
  </TouchableHighlight>

const TransactionList = (props) =>
  <View style={styles.flex}>
    <TransactionHeader />
    {props.loadingTransactions
      ? <ActivityIndicator size='large' style={styles.flex}/>
      : <ListView
            tabLabel='Transactions'
            style={styles.flex}
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
    }
  </View>


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
