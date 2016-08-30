import React from 'react'
import Tabs from './component/Tabs'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import {reducer, initialise} from './store/reducer'

class App extends React.Component {
  store = undefined

  constructor(){
    super()
    this.store = createStore(reducer, applyMiddleware(thunk))
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
