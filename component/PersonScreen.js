//////////////////////////////////////////////////////////////////////////////////////////
/*
  This screen does not work. Currently there is no way to to open it, so it doesnt matter.
  If we do want to add a person screen at some point, it must be updated to match TraderScreen
  because TransactionList has changed
*/
/////////////////////////////////////////////////////////////////////////////////////////

import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import ProfileHeader from './profileScreen/ProfileHeader'
import TransactionList from './profileScreen/TransactionList'
import { buildDataSourceForTransactions } from '../util/transaction'

const renderHeader = props => () =>
  <View style={{flex: 1}}>
    <ProfileHeader {...props}/>
    {props.renderHeaderExtension()}
  </View>

const PersonScreen = ({selectedPerson, dataSource, hideModal}) => (
  selectedPerson
    ? <TransactionList
        renderHeader={renderHeader({
          loaded: true,
          image: selectedPerson.image,
          category: 'person',
          name: '@' + selectedPerson.username,
          username: '',
          renderHeaderExtension: () => null,
          dataSource,
          onPressClose: () => hideModal(),
          onPressExpand: () => hideModal(),
        })}
        dataSource={dataSource}/>
    : <ActivityIndicator size='large'/>
)

// filter the transaction list to contain only those relating to this trader
const dataSourceForSelectedPerson = (state) => {
  const transactions = state.transaction.transactions.filter(transaction =>
      transaction.relatedAccount.kind === 'user' && transaction.relatedAccount.user.id === state.person.selectedPersonId)

  return buildDataSourceForTransactions(transactions)
}

const mapStateToProps = (state) => ({
  selectedPerson: state.person.personList.find(p => p.id === state.person.selectedPersonId),
  dataSource: dataSourceForSelectedPerson(state)
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonScreen)
