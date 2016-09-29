import _ from 'lodash'
import merge from '../../util/merge'
import { selectAndLoadBusiness } from './business'

const initialState = {
  tabIndex: 0,
  transactionTabIndex: 0,
  sendMoneyVisible: false,
  traderScreenVisible: false
}

export const navigateToTab = (tabIndex) => ({
  type: 'navigation/NAVIGATE_TO_TAB',
  tabIndex
})

export const navigateToTransactionTab = (transactionTabIndex) => ({
  type: 'navigation/NAVIGATE_TO_TRANSACTION_TAB',
  transactionTabIndex
})

export const showSendMoney = (show) => ({
  type: 'navigation/SHOW_SEND_MONEY',
  show
})

export const enableSearchMode = (enabled) => ({
  type: 'navigation/SEARCH_DIRECTORY',
  enabled
})

export const openDetailsModal = id =>
  (dispatch, getState) => {
    if (_.some(getState().business.businessList, b => b.id === id)) {
      dispatch(openTraderModal(id))
    }
  }

export const openTraderModal = businessId =>
  (dispatch) => {
    dispatch(selectAndLoadBusiness(businessId))
    dispatch(showTraderScreen(true))
  }

export const showTraderScreen = (show) => ({
  type: 'navigation/SHOW_TRADER_SCREEN',
  show
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navigation/NAVIGATE_TO_TAB':
      state = merge(state, {
        tabIndex: action.tabIndex
      })
      break
    case 'navigation/NAVIGATE_TO_TRANSACTION_TAB':
      state = merge(state, {
        transactionTabIndex: action.transactionTabIndex
      })
      break
    case 'navigation/SHOW_SEND_MONEY':
      state = merge(state, {
        sendMoneyVisible: action.show
      })
      break
    case 'navigation/SHOW_TRADER_SCREEN':
      state = merge(state, {
        traderScreenVisible: action.show
      })
      break
  }
  return state
}

export default reducer
