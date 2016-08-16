import { combineReducers } from 'redux'

import transaction, { loadTransactions } from './reducer/transaction'
import navigation from './reducer/navigation'
import business, { loadBusinesses } from './reducer/business'

export const reducer = combineReducers({
  transaction,
  navigation,
  business
})

export const initialise = (store) => {
    store.dispatch(loadBusinesses())
    store.dispatch(loadTransactions())
}
