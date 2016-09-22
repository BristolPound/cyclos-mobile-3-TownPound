import { combineReducers } from 'redux'

import transaction from './reducer/transaction'
import business, { loadBusinessList, updatePosition } from './reducer/business'
import navigation from './reducer/navigation'
import login from './reducer/login'
import sendMoney from './reducer/sendMoney'
import account from './reducer/account'
import networkConnection from './reducer/networkConnection'
import developerOptions from './reducer/developerOptions'

export const reducer = combineReducers({
  transaction,
  business,
  navigation,
  login,
  sendMoney,
  account,
  networkConnection,
  developerOptions,
})

const GEOLOCATION_SETTINGS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }

export const initialise = (store) => {
  store.dispatch(loadBusinessList())
  navigator.geolocation.getCurrentPosition(
    (position) => store.dispatch(updatePosition(position)),
    () => alert('Cannot get location. Is GPS enabled?'),
    GEOLOCATION_SETTINGS
  )
  navigator.geolocation.watchPosition(
    (position) => store.dispatch(updatePosition(position)),
    () => alert('Cannot get location. Is GPS enabled?'),
    GEOLOCATION_SETTINGS
  )
}
