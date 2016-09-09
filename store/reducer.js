import { combineReducers } from 'redux'

import transaction from './reducer/transaction'
import business, { loadBusinesses } from './reducer/business'
import navigation from './reducer/navigation'
import login from './reducer/login'
import sendMoney from './reducer/sendMoney'
import status from './reducer/status'
import account from './reducer/account'
import map from './reducer/map'

export const reducer = combineReducers({
  transaction,
  business,
  navigation,
  login,
  sendMoney,
  status,
  account,
  map
})

export const initialise = (store) => {
    store.dispatch(loadBusinesses())
}
