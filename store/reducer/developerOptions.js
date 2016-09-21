
import { updateRefreshing, loadBusinessesFromApi } from './business'
import { clearTransactions, loadInitialTransactions } from './transaction'

import { setBaseUrl } from '../../api'
import * as localStorage from '../../localStorage'
import merge from '../../util/merge'

const PROD_SERVER = 'https://bristol-stage.community-currency.org/cyclos/api/'
const DEV_SERVER = 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'

const initialState = {
  prodServer: true
}

export const switchBaseUrl = () => ({
  type: 'developerOptions/SWITCH_BASE_URL'
})

export const clearStoredBusinesses = () =>
  (dispatch) => {
      dispatch(updateRefreshing())
      localStorage.remove(localStorage.storageKeys.BUSINESS_KEY)
      dispatch(loadBusinessesFromApi())
    }

export const clearStoredTransactions = () =>
  (dispatch) => {
      dispatch(clearTransactions())
      dispatch(loadInitialTransactions())
    }

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
