import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, ActivityIndicator } from 'react-native'
import * as actions from '../store/reducer/navigation'
import modalState from '../store/reducer/modalState'
import commonStyle from './style'
import TransactionList from './profileScreen/TransactionList'
import ProfileHeader from './profileScreen/ProfileHeader'
import BusinessDetails from './businessDetails/BusinessDetails'

import SendMoney from './sendMoney/SendMoney'
import { buildDataSourceForTransactions } from '../util/transaction'

/**
 Where
    trader: selectedBusiness
    dataSource: for trader transactions
    showModal: callback for opening or closing this view.
 */
const TraderScreen = ({ trader, transactionsDataSource, showModal, loadingProfile }) =>
    <View style={{flex: 1}}>
      <TransactionList
        renderHeader={asRenderHeader(trader, transactionsDataSource, showModal, loadingProfile)}
        dataSource={transactionsDataSource} />
        <SendMoney
          payeeDisplay={trader.display}
          payeeShortDisplay={trader.shortDisplay}/>
      </View>

// Currently we pass in returned renderHeader as we delegate to a listView.
// One alternative would be to encapsulate this and use `props.children` instead.
const asRenderHeader = (trader, transactionsDataSource, showModal, loadingProfile) => () =>
  <View style={{flex: 1}}>
    <ProfileHeader
      name={trader.display}
      username={trader.shortDisplay}
      image={trader.image}
      category={trader.category}
      onPressClose={() => showModal(modalState.none)}
    />
    <View style={commonStyle.dropshadow}>
      <BusinessDetails business={trader} isExpanded={transactionsDataSource.getRowCount() === 0}/>
      { loadingProfile
        ? <ActivityIndicator style={{marginBottom: 10}} size='large'/>
        : undefined }
    </View>
  </View>

// filter the transaction list to contain only those relating to this trader
const dataSourceForSelectedBusiness = (state) => {
  const transactions = state.transaction.transactions.filter(transaction =>
      transaction.relatedAccount.kind === 'user' && transaction.relatedAccount.user.id === state.business.traderScreenBusinessId)

  return buildDataSourceForTransactions(transactions)
}

// Redux Setup
const mapStateToProps = (state) => ({
    trader: state.business.businessList.find(b => b.id === state.business.traderScreenBusinessId) || {},
    transactionsDataSource: dataSourceForSelectedBusiness(state),
    loadingProfile: state.business.loadingProfile
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
