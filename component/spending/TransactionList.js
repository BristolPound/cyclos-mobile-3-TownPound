import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Text, ListView, View, Image, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import TransactionHeader from './TransactionHeader'
import DefaultText from '../DefaultText'
import Price from '../Price'
import merge from '../../util/merge'
import color from '../../util/colors'
import * as actions from '../../store/reducer/transaction'
import { openDetailsModal, navigateToTransactionTab } from '../../store/reducer/navigation'

import styles, { navBarStyle } from './TransactionStyle'

const NavBar = props =>
  <View style={navBarStyle.tabBar}>
    {props.tabs.map((tab, i) =>
      <View style={merge(styles.flex, props.activeTab === i ? navBarStyle.underline : {})} key={i}>
        <TouchableHighlight
            style={navBarStyle.textContainer}
            onPress={() => props.goToPage(i)}
            underlayColor={color.transparent}>
          <Text style={merge(navBarStyle.text, {color: props.activeTab === i ? color.bristolBlue : color.gray})}>{tab}</Text>
        </TouchableHighlight>
      </View>
    )}
  </View>

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

const renderLoadingFooter = () =>
  <View style={merge(styles.headerContainer, styles.center)}>
    <ActivityIndicator/>
  </View>

const standardListViewProps = props => {
  return{
    style: styles.flex,
    pageSize: 10,
    renderSeparator: renderSeparator,
    enableEmptySections: true,
    renderRow: transaction => renderRow(transaction, props.openDetailsModal),
    renderFooter: () => props.loadingMoreTransactions ? renderLoadingFooter() : undefined
  }
}

const TransactionList = (props) =>
  <View style={styles.flex}>
    <TransactionHeader />
    {props.loadingTransactions
      ? <ActivityIndicator size='large' style={styles.flex}/>
      : (<ScrollableTabView
            renderTabBar={() => <NavBar />}
            initialPage={props.transactionTabIndex}
            scrollWithoutAnimation={true}
            locked={true}
            onChangeTab={({i}) => props.navigateToTransactionTab(i)}>
          <ListView
            tabLabel='Transactions'
            {...standardListViewProps(props)}
            dataSource={props.transactionsDataSource}
            renderSectionHeader={renderSectionHeader}
            refreshControl={<RefreshControl
              refreshing={props.refreshing}
              onRefresh={() => !props.refreshing && props.transactions && props.transactions.length > 0
                ? props.loadTransactionsAfterLast()
                : undefined} />
            }/>
          <ListView
            tabLabel='Categories'
            {...standardListViewProps(props)}
            dataSource={props.traderDataSource}
            refreshControl={<RefreshControl
              refreshing={props.refreshing}
              onRefresh={() => !props.refreshing && props.transactions && props.transactions.length > 0
                ? props.loadTransactionsAfterLast()
                : undefined} />
            }/>
        </ScrollableTabView>)}
  </View>


const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    ...actions,
    navigateToTransactionTab: navigateToTransactionTab,
    openDetailsModal: openDetailsModal
  }, dispatch)

const mapStateToProps = (state) => ({
  ...state.transaction,
  transactionTabIndex: state.navigation.transactionTabIndex
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
