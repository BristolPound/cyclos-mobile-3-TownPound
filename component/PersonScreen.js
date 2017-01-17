import React from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import ProfileHeader from './profileScreen/ProfileHeader'
import TransactionList from './profileScreen/TransactionList'
import { resetForm } from '../store/reducer/sendMoney'
import BusinessDetails from './businessDetails/BusinessDetails'
import SendMoney, { sectionHeight } from './SendMoney'

const PersonScreen = ({trader, transactions, hideModal, resetForm}) =>
  <View style={{flex: 1}}>
    <View style={{flex: 1, maxHeight: Dimensions.get('window').height - sectionHeight}}>
    <TransactionList
      renderHeader={renderHeader(trader, transactions, hideModal, resetForm)}
      listData={transactions} />
    </View>
    <SendMoney
      businessId={trader.id}
      payeeDisplay={trader.name}
      payeeShortDisplay={trader.username} />
  </View>

const renderHeader = (trader, transactions, hideModal, resetForm) => () =>
    <View style={{flex: 1}}>
      <ProfileHeader
        name={trader.name}
        username={trader.username}
        image={trader.image}
        category={trader.category}
        onPressClose={() => {hideModal(); resetForm()}}
        isModal={true} />
        <BusinessDetails business={trader}/>
    </View>


// filter the transaction list to contain only those relating to this trader
const getTransactionsForSelectedPerson = (state) => {
  return state.transaction.transactions.filter(transaction => {
    return transaction.relatedAccount.kind === 'user' && transaction.relatedAccount.user.id === state.person.selectedPersonId
  })
}


const mapStateToProps = (state) => ({
  trader: state.person.personList.find(p => p.id === state.person.selectedPersonId) || {},
  transactions: getTransactionsForSelectedPerson(state)
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({...actions, resetForm}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonScreen)
