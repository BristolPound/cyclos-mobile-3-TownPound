import { combineReducers } from 'redux'

import transaction from './reducer/transaction'
import business, { loadBusinessList, updatePosition } from './reducer/business'
import person from './reducer/person'
import navigation from './reducer/navigation'
import login from './reducer/login'
import sendMoney from './reducer/sendMoney'
import account from './reducer/account'
import networkConnection from './reducer/networkConnection'
import developerOptions from './reducer/developerOptions'

export const reducer = combineReducers({
  transaction,
  business,
  person,
  navigation,
  login,
  sendMoney,
  account,
  networkConnection,
  developerOptions,
})

export const initialise = (store) => {
  store.dispatch(loadBusinessList())
  navigator.geolocation.getCurrentPosition(
    (position) => store.dispatch(updatePosition(position)),
    () => alert('Cannot get location. Is GPS enabled?')
  )
  navigator.geolocation.watchPosition(
    (position) => store.dispatch(updatePosition(position)),
    () => alert('Cannot get location. Is GPS enabled?')
  )
}
