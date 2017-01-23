import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Dimensions } from 'react-native'
import * as actions from '../store/reducer/navigation'
import TransactionList from './profileScreen/TransactionList'
import ProfileHeader from './profileScreen/ProfileHeader'
import BusinessDetails from './businessDetails/BusinessDetails'
import SendMoney, { sectionHeight } from './SendMoney'
import { resetForm } from '../store/reducer/sendMoney'
import { goToLocation } from '../store/reducer/navigation'

const TraderScreen = ({ trader, transactions, hideModal, resetForm, goToLocation }) =>
  <View style={{flex: 1}}>
    <View style={{flex: 1, maxHeight: Dimensions.get('window').height - sectionHeight}}>
    <TransactionList
      renderHeader={asRenderHeader(trader, transactions, hideModal, resetForm, goToLocation)}
      listData={transactions} />
    </View>
  </View>

// Currently we pass in returned renderHeader as we delegate to a listView.
// One alternative would be to encapsulate this and use `props.children` instead.
const asRenderHeader = (trader, transactions, hideModal, resetForm, goToLocation) => () =>
  <View style={{flex: 1}}>
    <ProfileHeader
      name={trader.display}
      username={trader.shortDisplay}
      image={trader.image}
      category={trader.category}
      address={trader.address}
      onPressClose={() => {hideModal(); resetForm()}}
      isModal={true}
      goToLocation={() => goToLocation(trader.address.location)}/>
      <BusinessDetails business={trader} goToLocation={goToLocation}/>
  </View>

const getTransactionsForSelectedBusiness = (state) => {
  return state.transaction.transactions.filter(transaction => {
    return transaction.relatedAccount.kind === 'user' && transaction.relatedAccount.user.id === state.business.traderScreenBusinessId
  })
}

// Redux Setup
const mapStateToProps = (state) => ({
    trader: state.business.businessList.find(b => b.id === state.business.traderScreenBusinessId) || {},
    transactions: getTransactionsForSelectedBusiness(state)
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, resetForm, goToLocation }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
