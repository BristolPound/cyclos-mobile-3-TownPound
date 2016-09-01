import { combineReducers } from 'redux'

import transaction, { loadTransactions } from './reducer/transaction'
import business, { loadBusinesses } from './reducer/business'
import navigation from './reducer/navigation'

export const reducer = combineReducers({
  transaction,
  business,
  navigation
})

export const initialise = (store) => {
    store.dispatch(loadBusinesses())
    store.dispatch(loadTransactions())
}
