import React from 'react'
import { ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import modalState from '../store/reducer/modalState'
import ProfileScreen from './profileScreen/ProfileScreen'
import { buildDataSourceForTransactions } from '../util/transaction'

const PersonScreen = ({selectedPerson, dataSource, showModal}) => (
  selectedPerson
    ? <ProfileScreen
        loaded={true}
        image={selectedPerson.image}
        category={'person'}
        defaultImage={!Boolean(selectedPerson.image)}
        name={'@'+(selectedPerson.username)}
        username={''}
        renderHeaderExtension={() => null}
        dataSource={dataSource}
        onPressClose={() => showModal(modalState.none)}
        onPressExpand={()=> showModal(modalState.none)}/>
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
