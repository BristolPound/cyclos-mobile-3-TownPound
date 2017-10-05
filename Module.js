import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { AUTO_REHYDRATE_WITH_REDUCED_STATE } from 'redux-persist/es/constants'
import { PersistGate } from 'redux-persist/es/integration/react'
//import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4'
import { STORE_VERSION, storeMigration, Loading } from './src/util/updateStore'
import _ from 'lodash'
// initialise config, as long it is not implemented in the store
import config from './src/util/config'
import Root from './src/component/Root'
import { reducer, transforms, initialise } from './src/store/reducer'

/*
const ConfigV4 = {
  whitelist: ['business', 'transaction', 'login'],
  storage,
  transforms,
}
*/

const ConfigV5 = {
  key: 'root', // key is required
  storage, // storage is required
  version: STORE_VERSION,
  migrate: storeMigration,
  transforms,
//  getStoredState: getStoredStateMigrateV4(ConfigV4),
  autoRehydrate: AUTO_REHYDRATE_WITH_REDUCED_STATE,
}

const finalReducer = persistReducer(ConfigV5, reducer)

class Module extends React.Component {
  store = undefined
  persistor = undefined

  onBeforeLift = (store = this.store) => {
    // perform our initialisation logic after the store has re-hydrated
    initialise(store)
  }

  constructor(){
    super()

    let enhancers = [
      applyMiddleware(thunk),
    ]

    this.store =
      (__DEV__)
        ? createStore(finalReducer, composeWithDevTools(...enhancers))
        : createStore(finalReducer, compose(...enhancers))

    this.persistor = persistStore(this.store)
  }

  render() {
    return (
      <Provider store={this.store}>
        <PersistGate
          loading={Loading}
          onBeforeLift={this.onBeforeLift}
          persistor={this.persistor}>
          <Root />
        </PersistGate>
      </Provider>
    )
  }
}

export default Module
