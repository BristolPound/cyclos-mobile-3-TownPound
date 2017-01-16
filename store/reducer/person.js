import _ from 'lodash'
import merge from '../../util/merge'
import { addContact } from '../../api/contacts'
import { unknownError } from './statusMessage'
import { addFailedAction } from './networkConnection'
import { UNEXPECTED_DATA } from '../../api/apiError'
import { getPersonProfile } from '../../api/users'

const initialState = {
  personList: [],
  selectedPersonId: undefined
}

export const resetProfile = () => ({
  type: 'person/RESET_PROFILE',
})

export const personProfileReceived = (personProfile) => ({
  type: 'person/PERSON_PROFILE_RECEIVED',
  personProfile
})

export const loadPersonProfile = (personId) => (dispatch) => {
  getPersonProfile(personId, dispatch)
    .then(personProfile => {
      addContact(personId, dispatch)
        .then((newContactsList) => {
          dispatch(updatePersonList(newContactsList))
          dispatch(personProfileReceived(personProfile))
        })
        .catch((err) => dispatch(unknownError(err)))
    })
    // if this request fails, the modal trader screen will continue to show a spinner
    // but will be closeable
    .catch(err => {
      dispatch(addFailedAction(loadPersonProfile(personId)))
      if (err.type === UNEXPECTED_DATA) {
        dispatch(updateStatus('Account no longer exists', ERROR_SEVERITY.SEVERE))
      } else {
        dispatch(unknownError(err))
      }
    })
}

export const selectAndLoadPerson = (personId) => (dispatch, getState) => {
  // if not in personList then need to as a contact on API so that we can
  // access the data about the selected person
  dispatch(selectPerson(personId))
  if (!_.some(getState().person.personList, p => p.id === personId) && getState().networkConnection.status) {
    dispatch(loadPersonProfile(personId))
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
    case 'person/PERSON_PROFILE_RECEIVED':
      const index  = _.findIndex(state.personList, {id: action.personProfile.id})

      let additionalFields = {}
      if (action.personProfile.customValues) {
        additionalFields = _.fromPairs(
          _.map(action.personProfile.customValues, fieldEntry => [
            fieldEntry.field.internalName,
            fieldEntry.stringValue
          ])// shape: list of 2-element lists ([[name, value],[name1, value1], ...])
        ) // turns into object from key-value pairs ({name:value, name1:value1})
      }

      const updatedBusiness = merge(
        state.personList[index],
        {profilePopulated: true},
        action.personProfile,
        additionalFields
      )
      const newPersonList = [
        ..._.slice(state.personList, 0, index),
        updatedBusiness,
        ..._.slice(state.personList, index + 1)
      ]
      state = merge(state, {
        personList: newPersonList
      })
      break
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
    case 'person/RESET_PROFILE':
      state = merge(state, {
        personList: [],
        selectedPersonId: undefined
      })
      break
  }
  return state
}

export default reducer
