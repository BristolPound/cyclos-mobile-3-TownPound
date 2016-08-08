import React from 'react'
import Tabs from './Tabs'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { accountDetailsReceived, transactionsReceived } from './store/reducer/transaction'
import reducer from './store/reducer'

import { getAccount, getTransactions } from './api'

getAccount()
  .then(account => store.dispatch(accountDetailsReceived(account)))

getTransactions()
  .then(transactions => store.dispatch(transactionsReceived(transactions)))

const store = createStore(reducer, applyMiddleware(thunk))

const App = () =>
  <Provider store={store}>
    <Tabs />
  </Provider>

export default App
