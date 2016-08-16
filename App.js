import React from 'react'
import Tabs from './component/Tabs'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import {reducer, initialise} from './store/reducer'

const store = createStore(reducer, applyMiddleware(thunk))
initialise(store)

const App = () =>
  <Provider store={store}>
    <Tabs />
  </Provider>

export default App
