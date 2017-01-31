import React from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import ProfileHeader from './profileScreen/ProfileHeader'
import TransactionList from './profileScreen/TransactionList'
import { resetForm } from '../store/reducer/sendMoney'
import BusinessDetails from './businessDetails/BusinessDetails'
import { sectionHeight } from './SendMoney'

const PersonScreen = (props) =>
  <View style={{flex: 1}}>
    <View style={{flex: 1, maxHeight: Dimensions.get('window').height - sectionHeight}}>
      <TransactionList
        renderHeader={renderHeader(props)}
        listData={props.transactions} />
    </View>
  </View>

const renderHeader = ({ person, hideModal, resetForm }) => () =>
    <View style={{flex: 1}}>
      <ProfileHeader
        name={person.name}
        username={person.username}
        image={person.image}
        category={person.category}
        onPressClose={() => {hideModal(); resetForm()}}
        isModal={true} />
        <BusinessDetails business={person}/>
    </View>


// filter the transaction list to contain only those relating to this person
const getTransactionsForSelectedPerson = (state) => {
  return state.transaction.transactions.filter(transaction => {
    return transaction.relatedAccount.kind === 'user' && transaction.relatedAccount.user.id === state.person.selectedPersonId
  })
}


const mapStateToProps = (state) => ({
  person: state.person.personList.find(p => p.id === state.person.selectedPersonId) || {},
  transactions: getTransactionsForSelectedPerson(state)
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({...actions, resetForm}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonScreen)
