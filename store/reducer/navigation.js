import merge from '../../util/merge'

const initialState = {
  tabIndex: 0,
  transactionTabIndex: 0,
  sendMoneyVisible: false,
  businessDetailsVisible: false
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

export const openDetailsModal = toOpen =>
  (dispatch, getState) => {
    // TODO: open user details here when someone clicks on a user in transaction list
    const businessToShow = getState().business.business.find(bu => bu.id === toOpen.id)
    if (businessToShow) {
      dispatch(showBusinessDetails(businessToShow))
    }
  }

export const showBusinessDetails = (show) => ({
  type: 'navigation/SHOW_BUSINESS_DETAILS',
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
    case 'navigation/SHOW_BUSINESS_DETAILS':
      state = merge(state, {
        businessDetailsVisible: action.show
      })
      break
    case 'navigation/SEARCH_DIRECTORY':
      state = merge(state, {
        searchMode: action.enabled
      })
      break
  }
  return state
}

export default reducer
