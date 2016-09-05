import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import devTools from 'remote-redux-devtools'

import Tabs from './component/Tabs'
import {reducer, initialise} from './store/reducer'

class App extends React.Component {
  store = undefined

  constructor(){
    super()
    const enhancer = process.env.PROD ? applyMiddleware(thunk)
    : compose(
      applyMiddleware(thunk),
      devTools()
    )
    this.store = createStore(reducer, enhancer)
    devTools.updateStore(this.store)
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
