import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ListView, View, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native'
import moment from 'moment'
import ProfileImage from '../profileImage/ProfileImage'
import SpendingHeader from './SpendingHeader'
import DefaultText from '../DefaultText'
import Price from '../Price'
import color from '../../util/colors'
import * as actions from '../../store/reducer/transaction'
import { openDetailsModal, navigateToTransactionTab } from '../../store/reducer/navigation'
import styles from './spendingStyle'

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


class SpendingTab extends React.Component {
  componentWillReceiveProps() {
    if (this.listViewRef) {
      // Yes, ListView really wants us to call this twice
      this.listViewRef.scrollTo({ y: 0 })
      this.listViewRef.scrollTo({ y: 0 })
    }
  }
  render() {
    let bodyComponent
    if (this.props.loadingTransactions) {
      bodyComponent = <ActivityIndicator size='large' style={styles.loadingIndicator}/>
    } else if (this.props.transactions.length > 0) {
      bodyComponent = <ListView
          ref={(lv) => this.listViewRef = lv}
          tabLabel='Transactions'
          style={styles.list}
          pageSize={10}
          renderSeparator={renderSeparator}
          enableEmptySections={true}
          renderRow={transaction => renderRow(transaction, this.props.openDetailsModal)}
          dataSource={this.props.transactionsDataSource}
          renderSectionHeader={renderSectionHeader}
          refreshControl={<RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={() => !this.props.refreshing ? this.props.loadMoreTransactions() : undefined} />
          }/>
    } else {
      bodyComponent = <View style={styles.noTransactions.container}>
        <DefaultText style={styles.noTransactions.text}>You have made no transactions</DefaultText>
        <DefaultText style={styles.noTransactions.text}>this month</DefaultText>
      </View>
    }

    return (
      <View style={styles.container}>
        <SpendingHeader />
        {bodyComponent}
      </View>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(SpendingTab)
