import merge from '../../util/merge'

const initialState = {
  tabIndex: 0,
  sendMoneyVisible: false
}

export const navigateToTab = (tabIndex) => ({
  type: 'navigation/NAVIGATE_TO_TAB',
  tabIndex
})

export const showSendMoney = (show) => ({
  type: 'navigation/SHOW_SEND_MONEY',
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
  }
  return state
}

export default reducer
