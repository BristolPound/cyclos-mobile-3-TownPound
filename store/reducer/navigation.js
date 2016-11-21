import _ from 'lodash'
import merge from '../../util/merge'
import { selectAndLoadBusiness } from './business'
import { selectAndLoadPerson } from './person'
import { LOGGED_OUT, LOGGED_IN } from './login'

const initialState = {
  tabIndex: 0,
  modalState: modalState.none,
  returningLogin: false,
  stateInitialised: false
}

export const navigateToTab = (tabIndex) => ({
  type: 'navigation/NAVIGATE_TO_TAB',
  tabIndex
})

export const returningLogin = () => ({
  type: 'navigation/RETURNING_LOGIN'
})

export const stateInitialised = () => ({
  type: 'navigation/STATE_INITIALIZED'
})

export const modalState = {
  none: 'none',
  traderScreen: 'traderScreen',
  personScreen: 'personScreen',
  developerOptions: 'developerOptions',
}

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
    case LOGGED_OUT:
    case LOGGED_IN:
      state = merge(state, {
        returningLogin: false
      })
      break
    case 'navigation/RETURNING_LOGIN':
      state = merge(state, {
        returningLogin: true
      })
      break
    case 'navigation/STATE_INITIALIZED':
      state = merge(state, {
        stateInitialised: true
      })
      break
  }
  return state
}

export default reducer
