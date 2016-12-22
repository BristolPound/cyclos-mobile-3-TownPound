import { combineReducers } from 'redux'
import { NetInfo } from 'react-native'

import transaction from './reducer/transaction'
import business, { loadBusinessList, geolocationChanged, geoloctaionFailed } from './reducer/business'
import person from './reducer/person'
import navigation, { selectMainComponent, mainComponent, stateInitialised } from './reducer/navigation'
import login from './reducer/login'
import sendMoney from './reducer/sendMoney'
import account from './reducer/account'
import networkConnection, {connectivityChanged} from './reducer/networkConnection'
import developerOptions from './reducer/developerOptions'
import statusMessage from './reducer/statusMessage'
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
  statusMessage
})

export const initialise = (store) => {
  NetInfo.isConnected.addEventListener(
    'change',
    (status) => store.dispatch(connectivityChanged(status))
  )

  store.dispatch(loadBusinessList())

  navigator.geolocation.getCurrentPosition(
    ({coords}) => geolocationChanged(coords, store.dispatch),
    () => {
      alert('Unable to get location. Are location services enabled?')
      store.dispatch(geoloctaionFailed())
    }
  )

  setBaseUrl(store.getState().developerOptions.server)

  store.dispatch(stateInitialised())
  if (store.getState().login.loggedInUsername) {
    store.dispatch(selectMainComponent(mainComponent.returningLogin))
  }
}
