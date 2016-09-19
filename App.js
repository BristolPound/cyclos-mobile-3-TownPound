import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import devTools from 'remote-redux-devtools'

import Tabs from './component/Tabs'
import { reducer, initialise } from './store/reducer'

class App extends React.Component {
  store = undefined

  constructor(){
    super()
    const enhancer = __DEV__
      ? compose(
        applyMiddleware(thunk),
        devTools()
      )
      : applyMiddleware(thunk)
    this.store = createStore(reducer, enhancer)
    if (__DEV__) {
      devTools.updateStore(this.store)
    }
    initialise(this.store)
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
