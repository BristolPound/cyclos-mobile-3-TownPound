import { combineReducers } from 'redux'

import transaction, { loadTransactions } from './reducer/transaction'
import business, { loadBusinesses } from './reducer/business'
import navigation from './reducer/navigation'
import sendMoney from './reducer/sendMoney'

export const reducer = combineReducers({
  transaction,
  business,
  navigation,
  sendMoney
})

export const initialise = (store) => {
    store.dispatch(loadBusinesses())
    store.dispatch(loadTransactions())
}
