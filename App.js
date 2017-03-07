import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools'
import { persistStore, autoRehydrate, createTransform } from 'redux-persist'
import { AsyncStorage } from 'react-native'
import _ from 'lodash'
import Root from './component/Root'
import { reducer, initialise } from './store/reducer'

class App extends React.Component {
  store = undefined

  constructor(){
    super()

    let enhancers = [
      applyMiddleware(thunk),
      autoRehydrate()
    ]

    this.store = 
      (__DEV__) 
        ? createStore(reducer, composeWithDevTools(...enhancers)) 
        : createStore(reducer, compose(...enhancers))

    persistStore(this.store, {
      whitelist: ['business', 'transaction', 'developerOptions', 'login'],
      storage: AsyncStorage,
      transforms: [
        createTransform(
          (state) => _.pick(state, ['businessList', 'businessListTimestamp']),
          (state) => state,
          {whitelist: ['business']}
        ),
        createTransform(
          (state) => _.pick(state, ['transactions', 'monthlyTotalSpent']),
          (state) => state,
          {whitelist: ['transaction']}
        ),
        createTransform(
          (state) => _.pick(state, ['loggedInUsername']),
          (state) => ({
            // this 'auto fills' the username field
            loggedInUsername: state.loggedInUsername,
          }),
          {whitelist: ['login']}
        )
      ]
    }, () => {
      // perform our initialisation logic after the store has re-hydrated
      initialise(this.store)
    })
  }

  render() {
    return (
      <Provider store={this.store}>
        <Root />
      </Provider>
    )
  }
}

export default App
