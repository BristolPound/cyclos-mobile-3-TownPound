import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import devTools from 'remote-redux-devtools'
import { persistStore, autoRehydrate, createTransform } from 'redux-persist'
import { AsyncStorage } from 'react-native'
import _ from 'lodash'

import Tabs from './component/Tabs'
import { reducer, initialise } from './store/reducer'

class App extends React.Component {
  store = undefined

  constructor(){
    super()

    let enhancers = [
      applyMiddleware(thunk),
      autoRehydrate()
    ]
    if (__DEV__) {
      enhancers.push(devTools())
    }

    this.store = createStore(reducer, compose(...enhancers))

    persistStore(this.store, {
      whitelist: ['business'],
      storage: AsyncStorage,
      transforms: [
        createTransform(
          (state) => _.pick(state, ['businessList', 'businessListTimestamp']),
          (state) => state,
          {whitelist: ['business']}
        )
      ]
    }, () => {
      // perform our initialisation logic after the store has re-hydrated
      initialise(this.store)
    })

    if (__DEV__) {
      devTools.updateStore(this.store)
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <Tabs />
      </Provider>
    )
  }
}

export default App
