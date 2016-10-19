import _ from 'lodash'
import merge from '../../util/merge'
import { addContact } from '../../api'

const initialState = {
  personList: [],
  selectedPersonId: undefined
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

const selectPerson = (personId) => ({
  type: 'person/SELECT_PERSON',
  personId
})

const updatePersonList = (newPersonList) => ({
  type: 'person/UPDATE_PERSON_LIST',
  newPersonList
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'person/SELECT_PERSON':
      state = merge(state, {
        selectedPersonId: action.personId
      })
      break
    case 'person/UPDATE_PERSON_LIST':
      state = merge(state, {
        personList: action.newPersonList
      })
      break
  }
  return state
}

export default reducer
