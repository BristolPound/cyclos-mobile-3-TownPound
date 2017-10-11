import { combineReducers } from 'redux'
import { NetInfo } from 'react-native'

import * as transaction     from './reducer/transaction'
import * as business        from './reducer/business'
import person from './reducer/person'
import navigation, { selectMainComponent, mainComponent } from './reducer/navigation'
import * as login           from './reducer/login'
import sendMoney from './reducer/sendMoney'
import account from './reducer/account'
import networkConnection, {connectivityChanged, addFailedAction } from './reducer/networkConnection'
import developerOptions from './reducer/developerOptions'
import statusMessage from './reducer/statusMessage'
import { setBaseUrl } from '../api/api'
import { Location, Permissions } from 'expo'

export const reducer = combineReducers({
  transaction.reducer,
  business.reducer,
  person,
  navigation,
  login.reducer,
  sendMoney,
  account,
  networkConnection,
  developerOptions,
  statusMessage,
})

export const transforms = [
  business.transform,
  transaction.transform,
  login.transform,
]

export const initialise = (store) => {

  // queue load business list for when connection is available
  store.dispatch(addFailedAction(business.loadBusinessList()))

  NetInfo.isConnected.fetch()
    .then((status) => status && store.dispatch(connectivityChanged(true)))
    .then(() => NetInfo.isConnected.addEventListener(
      'change',
      (status) => store.dispatch(connectivityChanged(status))
    ))

  let _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      alert('Unable to get location. Are location services enabled?')
      store.dispatch(business.geolocationFailed())
    }

    let location = await Location.getCurrentPositionAsync({})
    business.geolocationChanged(location.coords, store.dispatch)
  }

  _getLocationAsync()

  if (store.getState().login.loggedInUsername) {
    store.dispatch(selectMainComponent(mainComponent.returningLogin))
  }
  if (!store.getState().login.AUID) {
    store.dispatch(login.generateAUID())
  }
  // If there is no stored password (encrypted) then store password should
  // revert to false - in case a PIN is set and disclaimer agreed then
  // the app is closed and opened before logging in
  if (store.getState().login.encryptedPassword === '') {
    store.dispatch(login.setStorePassword(false))
  }
}
