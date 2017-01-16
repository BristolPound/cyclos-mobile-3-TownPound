import React from 'react'
import { ActivityIndicator, View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import ProfileHeader from './profileScreen/ProfileHeader'
import TransactionList from './profileScreen/TransactionList'
import { resetForm } from '../store/reducer/sendMoney'
import { buildDataSourceForTransactions } from '../util/transaction'
import marginOffset from '../util/marginOffset'
import BusinessDetails from './businessDetails/BusinessDetails'
import SendMoney, { sectionHeight } from './SendMoney'

const PersonScreen = ({trader, transactions, hideModal, loadingProfile, resetForm}) =>
  <View style={{flex: 1}}>
    <View style={{flex: 1, maxHeight: marginOffset(Dimensions.get('window').height) - sectionHeight}}>
    <TransactionList
      renderHeader={renderHeader(trader, transactions, hideModal, loadingProfile, resetForm)}
      listData={transactions} />
    </View>
    <SendMoney
      businessId={trader.id}
      payeeDisplay={trader.name}
      payeeShortDisplay={trader.username} />
  </View>

const renderHeader = (trader, transactions, hideModal, loadingProfile, resetForm) => () =>
    <View style={{flex: 1}}>
      <ProfileHeader
        name={trader.name}
        username={trader.username}
        image={trader.image}
        category={trader.category}
        onPressClose={() => {hideModal(); resetForm()}}
        isModal={true} />
        <BusinessDetails business={trader}/>
        { loadingProfile
          ? <ActivityIndicator style={{marginBottom: 10}} size='large'/>
          : undefined }
    </View>


// filter the transaction list to contain only those relating to this trader
const getTransactionsForSelectedPerson = (state) => {
  return state.transaction.transactions.filter(transaction => {
    return transaction.relatedAccount.kind === 'user' && transaction.relatedAccount.user.id === state.person.selectedPersonId
  })
}


const mapStateToProps = (state) => ({
  trader: state.person.personList.find(p => p.id === state.person.selectedPersonId) || {},
  transactions: getTransactionsForSelectedPerson(state),
  loadingProfile: state.person.loadingProfile
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({...actions, resetForm}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonScreen)
