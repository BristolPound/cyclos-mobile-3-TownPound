import { combineReducers } from 'redux'

import transaction from './reducer/transaction'
import business, { loadBusinesses } from './reducer/business'
import navigation from './reducer/navigation'
import login from './reducer/login'
import sendMoney from './reducer/sendMoney'
import position, { updatePosition } from './reducer/position'
import account from './reducer/account'
import map from './reducer/map'
import networkConnection from './reducer/networkConnection'

export const reducer = combineReducers({
  transaction,
  business,
  navigation,
  login,
  sendMoney,

  position,

  account,
  map,

  networkConnection
})

const GEOLOCATION_SETTINGS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }

export const initialise = (store) => {
  store.dispatch(loadBusinesses())
    .then(() => navigator.geolocation.getCurrentPosition(
      (position) => store.dispatch(updatePosition(position)),
      () => alert('Cannot get location. Is GPS enabled?'),
      GEOLOCATION_SETTINGS
    ))
  navigator.geolocation.watchPosition(
    (position) => store.dispatch(updatePosition(position)),
    () => alert('Cannot get location. Is GPS enabled?'),
    GEOLOCATION_SETTINGS
  )
}
