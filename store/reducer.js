import { combineReducers } from 'redux'
import { NetInfo } from 'react-native'

import transaction from './reducer/transaction'
import business, { loadBusinessList, geolocationChanged } from './reducer/business'
import person from './reducer/person'
import navigation, { returningLogin, stateInitialised } from './reducer/navigation'
import login from './reducer/login'
import sendMoney from './reducer/sendMoney'
import account from './reducer/account'
import networkConnection, {connectivityChanged} from './reducer/networkConnection'
import developerOptions from './reducer/developerOptions'
import { setBaseUrl } from '../api/api'

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

//TODO: Handle GPS errors

export const initialise = (store) => {
  NetInfo.isConnected.addEventListener(
    'change',
    (status) => store.dispatch(connectivityChanged(status))
  )

  store.dispatch(loadBusinessList())

  navigator.geolocation.getCurrentPosition(
    ({coords}) => geolocationChanged(coords, store.dispatch),
    () => {}
  )

  setBaseUrl(store.getState().developerOptions.server)

  store.dispatch(stateInitialised())
  if (store.getState().login.loggedInUsername) {
    store.dispatch(returningLogin())
  }
}
