import _ from 'lodash'
import merge from '../../util/merge'
import { selectAndLoadBusiness } from './business'
import { selectAndLoadPerson } from './person'
import { LOGGED_OUT, LOGGED_IN } from './login'
import { updateMapViewportAndSelectClosestTrader, updateSearchMode, moveMap } from './business'

export const modalState = {
  none: 'none',
  traderScreen: 'traderScreen',
  personScreen: 'personScreen',
  developerOptions: 'developerOptions',
}

export const mainComponent = {
  onboarding: 'onboarding',
  returningLogin: 'returningLogin',
  tabs: 'tabs',
}

const initialState = {
  tabIndex: 0,
  modalState: modalState.none,
  mainComponent: mainComponent.onboarding,
  stateInitialised: false,
  modalVisible: false,
  message: undefined,
  amount: undefined,
  timestamp: undefined
}

export const navigateToTab = (tabIndex) => ({
  type: 'navigation/NAVIGATE_TO_TAB',
  tabIndex
})

export const selectMainComponent = (componentName) => ({
  type: 'navigation/SELECT_MAIN_COMPONENT',
  componentName
})

export const stateInitialised = () => ({
  type: 'navigation/STATE_INITIALIZED'
})

export const closeConfirmation = () => ({
  type: 'navigation/CLOSE_CONFIRMATION'
})

export const openDetailsModal = id =>
  (dispatch, getState) => {
    // it is not possible to determine whether an id related to a trader (i.e. a BP user)
    // or a contact from the transaction. As a result we have to look up the id in the business
    // list in order to determine the type
    if (_.some(getState().business.businessList, b => b.id === id)) {
      dispatch(openTraderModal(id))
    } else {
      // Open Person screen
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

export const hideModal = () => ({
  type: 'navigation/HIDE_MODAL',
})

export const goToLocation = (location) =>
  (dispatch) => {
    dispatch(updateSearchMode(false))
    dispatch(updateMapViewportAndSelectClosestTrader(location))
    dispatch(navigateToTab(0))
    dispatch(moveMap())
    dispatch(hideModal())
  }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navigation/NAVIGATE_TO_TAB':
      state = merge(state, {
        tabIndex: action.tabIndex
      })
      break
    case 'navigation/SHOW_MODAL':
      state = merge(state, {
        modalState: action.modalState,
        modalVisible: true,
      })
      break
    case 'navigation/HIDE_MODAL':
      state = merge(state, {
        modalVisible: false
      })
      break
    case LOGGED_OUT:
    case LOGGED_IN:
      state = merge(state, {
        mainComponent: mainComponent.tabs
      })
      break
    case 'navigation/SELECT_MAIN_COMPONENT':
      state = merge(state, {
        mainComponent: action.componentName
      })
      break
    case 'navigation/STATE_INITIALIZED':
      state = merge(state, {
        stateInitialised: true
      })
      break
    case 'sendMoney/TRANSACTION_COMPLETE':
      if (action.success) {
        state = merge(state, {
          message: action.message,
          amount: action.amount,
          timestamp: action.timestamp,
          transactionNumber: action.transactionNumber
        })
      }
      break
    case 'navigation/CLOSE_CONFIRMATION':
      state = merge(state, {
          message: undefined,
          amount: undefined,
          timestamp: undefined
      })
      break
  }
  return state
}

export default reducer
