
import { loadBusinessList, resetBusinesses, resetTraderTransactions } from './business'
import { setSelectedMonth, resetTransactions } from './transaction'
import { setBaseUrl } from '../../api'
import { purgeStoredState } from 'redux-persist'
import { AsyncStorage } from 'react-native'
import merge from '../../util/merge'

const PROD_SERVER = 'https://bristol-stage.community-currency.org/cyclos/api/'
const DEV_SERVER = 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'

const initialState = {
  prodServer: true
}

export const switchBaseUrl = () => ({
  type: 'developerOptions/SWITCH_BASE_URL'
})

export const clearBusinesses = () =>
  (dispatch) =>
    purgeStoredState({storage: AsyncStorage}, ['business']).then(() => {
      dispatch(resetBusinesses())
      dispatch(loadBusinessList(true))
      dispatch(resetTraderTransactions())
    })

export const clearTransactions = (reloadTransactions) =>
  (dispatch) =>
    purgeStoredState({storage: AsyncStorage}, ['transaction']).then(() => {
      dispatch(resetTransactions())
      dispatch(resetTraderTransactions())
      if (reloadTransactions) {
        dispatch(setSelectedMonth())
      }
    })

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'developerOptions/SWITCH_BASE_URL':
      setBaseUrl(state.prodServer ? DEV_SERVER : PROD_SERVER)
      state = merge(state, {
        prodServer: !state.prodServer
      })
      break
  }
  return state
}

export default reducer
