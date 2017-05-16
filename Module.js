import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools'
import { persistStore, autoRehydrate, createTransform } from 'redux-persist'
import { AsyncStorage } from 'react-native'
import _ from 'lodash'
import Root from './src/component/Root'
import { reducer, initialise } from './src/store/reducer'
import { Font } from 'expo';

class Module extends React.Component {
  store = undefined

  constructor(){
    super()

    Font.loadAsync({
      'MuseoSans-300': require('../assets/fonts/MuseoSans-300.ttf'),
      'MuseoSans-100': require('../assets/fonts/MuseoSans-100.ttf'),
      'MuseoSans-500': require('../assets/fonts/MuseoSans-500.ttf'),
      'MuseoSans-700': require('../assets/fonts/MuseoSans-700.ttf'),
      'MuseoSans-900': require('../assets/fonts/MuseoSans-900.ttf'),
      'MuseoSans-300': require('../assets/fonts/MuseoSans-300.ttf'),
      'MuseoSans-100Italic': require('../assets/fonts/MuseoSans-100Italic.ttf'),
      'MuseoSans-500Italic': require('../assets/fonts/MuseoSans-500Italic.ttf'),
      'MuseoSans-700Italic': require('../assets/fonts/MuseoSans-700Italic.ttf'),
      'MuseoSans-900Italic': require('../assets/fonts/MuseoSans-900Italic.ttf')
    });
    
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

export default Module