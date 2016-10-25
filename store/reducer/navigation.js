import _ from 'lodash'
import merge from '../../util/merge'
import { selectAndLoadBusiness } from './business'
import { selectAndLoadPerson } from './person'
import modalState from './modalState'

const initialState = {
  tabIndex: 0,
  modalState: modalState.none
}

export const navigateToTab = (tabIndex) => ({
  type: 'navigation/NAVIGATE_TO_TAB',
  tabIndex
})

export const openDetailsModal = id =>
  (dispatch, getState) => {
    // it is not possible to determine whether an id related to a trader (i.e. a BP user)
    // or a contact from the transaction. As a result we have to look up the id in the business
    // list in order to determine the type
    if (_.some(getState().business.businessList, b => b.id === id)) {
      dispatch(openTraderModal(id))
    } else {
      dispatch(openPersonModal(id))
    }
  }

export const openTraderModal = businessId =>
  (dispatch) => {
    dispatch(selectAndLoadBusiness(businessId))
    dispatch(showModal(modalState.traderScreen))
  }

export const openPersonModal = personId =>
  dispatch => {
    dispatch(selectAndLoadPerson(personId))
    dispatch(showModal(modalState.personScreen))
  }

export const showModal = (modalState) => ({
  type: 'navigation/SHOW_MODAL',
  modalState
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navigation/NAVIGATE_TO_TAB':
      state = merge(state, {
        tabIndex: action.tabIndex
      })
      break
    case 'navigation/SHOW_MODAL':
      state = merge(state, {
        modalState: action.modalState
      })
      break
  }
  return state
}

export default reducer
