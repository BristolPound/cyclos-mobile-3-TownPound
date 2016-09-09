import merge from '../../util/merge'

const initialState = {
  tabIndex: 0,
  sendMoneyVisible: false,
  businessDetailsVisible: false
}

export const navigateToTab = (tabIndex) => ({
  type: 'navigation/NAVIGATE_TO_TAB',
  tabIndex
})

export const showSendMoney = (show) => ({
  type: 'navigation/SHOW_SEND_MONEY',
  show
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
    case 'navigation/SHOW_SEND_MONEY':
      state = merge(state, {
        sendMoneyVisible: action.show
      })
      break
    case 'navigation/SHOW_BUSINESS_DETAILS':
      state = merge(state, {
        businessDetailsVisible: action.show
      })
  }
  return state
}

export default reducer
