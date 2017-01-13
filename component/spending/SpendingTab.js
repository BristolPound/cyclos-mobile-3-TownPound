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

const getTransactionImage = (user, businessList) => {
  if (user) {
    const userDetails = businessList.find(business => business.id === user.id)
    if (userDetails && userDetails.image) {
      return { uri: userDetails.image.url }
    }
  }
}

const renderRow = (transaction, openDetailsModal, businessList) =>
  <TouchableHighlight
      onPress={() => transaction.relatedAccount.user && openDetailsModal(transaction.relatedAccount.user.id)}
      underlayColor={color.transparent}
      key={transaction.transactionNumber}>
    <View style={styles.row.container}>
      <ProfileImage
        image={getTransactionImage(transaction.relatedAccount.user, businessList)}
        style={styles.row.image}
        category='shop'
        colorCode={0}/>
      <View style={styles.row.textContainer}>
        <DefaultText style={styles.row.text}>
          { transaction.relatedAccount.user ? transaction.relatedAccount.user.display : 'System' }
        </DefaultText>
        <Price price={transaction.amount} style={styles.row.price} size={22}/>
      </View>
    </View>
  </TouchableHighlight>


class SpendingTab extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.listViewRef && !nextProps.scrolled) {
      // Yes, ListView really wants us to call this twice
      this.listViewRef.scrollTo({ y: 0 })
      this.listViewRef.scrollTo({ y: 0 })
    }
  }
  render() {
    let bodyComponent
    const dataSource = this.props.transactionsDataSource
    if (this.props.loadingTransactions) {
      bodyComponent = <ActivityIndicator size='large' style={styles.loadingIndicator}/>
    } else if (dataSource.getRowCount()) {
      bodyComponent = <ListView
          ref={(lv) => this.listViewRef = lv}
          style={{backgroundColor: color.offWhite}}
          tabLabel='Transactions'
          pageSize={10}
          renderSeparator={renderSeparator}
          enableEmptySections={true}
          renderRow={transaction => renderRow(transaction, this.props.openDetailsModal, this.props.businessList)}
          dataSource={dataSource}
          onScroll={() => !this.props.scrolled && this.props.transactionsScrolled()}
          renderSectionHeader={renderSectionHeader}
          refreshControl={this.props.selectedMonthIndex === this.props.monthlyTotalSpent.length - 1
            ? <RefreshControl
                  refreshing={this.props.refreshing}
                  onRefresh={() => !this.props.refreshing ? this.props.loadMoreTransactions() : undefined} />
            : undefined
          }
          removeClippedSubviews={false}/>
    } else {
      bodyComponent = <View style={styles.noTransactions.container}>
        <DefaultText style={styles.noTransactions.text}>You have made no transactions</DefaultText>
        <DefaultText style={styles.noTransactions.text}>this month</DefaultText>
      </View>
    }

    return (
      <View style={{flex: 1}}>
        <View style={styles.header.carouselContainer}>
          <SpendingHeader />
        </View>
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
  ...state.transaction,
  businessList: state.business.businessList
})

export default connect(mapStateToProps, mapDispatchToProps)(SpendingTab)
