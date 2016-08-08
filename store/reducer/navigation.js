import merge from '../../merge'

const initialState = {
  selectedTab: 'business',
  sendMoneyVisible: false
}

export const navigateToTab = (tabName) => ({
  type: 'navigation/NAVIGATE_TO_TAB',
  tabName
})

export const showSendMoney = (show) => ({
  type: 'navigation/SHOW_SEND_MONEY',
  show
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navigation/NAVIGATE_TO_TAB':
      state = merge(state, {
        selectedTab: action.tabName
      })
      break
    case 'navigation/SHOW_SEND_MONEY':
      state = merge(state, {
        sendMoneyVisible: action.show
      })
      break
  }
  return state
}

export default reducer
