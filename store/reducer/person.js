import { ListView } from 'react-native'
import _ from 'lodash'
import merge from '../../util/merge'
import { addContact } from '../../api'
import { sortTransactions, groupTransactionsByDate } from '../../util/transaction'
import { showPersonScreen} from './navigation'
const initialState = {
  personList: [],
  selectedPersonId: undefined,
  personTransactionsDataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
}

export const selectAndLoadPerson = (personId) => (dispatch, getState) => {
  // if not in personList then need to as a contact on API so that we can
  // access the data about the selected person
  if (!_.some(getState().person.personList, p => p.id === personId)) {
    addContact(personId, dispatch)
      .then((newContactsList) => {
        dispatch(updatePersonList(newContactsList))
        dispatch(selectPerson(personId))
      })
  } else {
    dispatch(selectPerson(personId))
  }
}

const selectPerson = (personId) => (dispatch, getState) => {
  const personTransactions =
    getState().transaction.transactions.filter(transaction =>
      transaction.relatedAccount.kind==='user'
      ? transaction.relatedAccount.user.id===personId
      : false)

  dispatch({
    type: 'person/SELECT_PERSON',
    personId,
    personTransactions
  })
  dispatch(showPersonScreen(true))
}

const updatePersonList = (newPersonList) => ({
  type: 'person/UPDATE_PERSON_LIST',
  newPersonList
})

export const resetPersonTransactions = () => ({
  type: 'person/RESET_PERSON_TRANSACTIONS'
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'person/SELECT_PERSON':
      const sortedTransactions = sortTransactions(action.personTransactions)
      const group = groupTransactionsByDate(sortedTransactions, 'mmmm yyyy', true)
      state = merge(state, {
        selectedPersonId: action.personId,
        personTransactionsDataSource: state.personTransactionsDataSource.cloneWithRowsAndSections(group.groups, group.groupOrder)
      })
      break
    case 'person/UPDATE_PERSON_LIST':
      state = merge(state, {
        personList: action.newPersonList
      })
      break
    case 'person/RESET_PERSON_TRANSACTIONS':
      state = merge(state, {
        personTransactionsDataSource: state.personTransactionsDataSource.cloneWithRows([])
      })
      break
  }
  return state
}

export default reducer
