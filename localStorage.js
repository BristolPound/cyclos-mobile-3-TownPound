/*
  Wrapper for AsyncStorage to consistently log errors and to hide stale data thresholds.
  Note: AsyncStorage is unencryted and should only be used for light storage.
*/

import { AsyncStorage } from 'react-native'

const DEFAULT_KEY_PREFIX = '@BristolPoundStore:'
const BUSINESS_KEY = 'BUSINESSES'
const STALE_DATA_THRESHOLD = 24 * 60 * 60 * 1000 //TODO: find out what we want here. Currently: milliseconds in a day

const wrapDataForStorage = (dataToStore) =>
  JSON.stringify({
    storedTime: Date.now(),
    data: dataToStore
  })

const unwrapDataFromStorage = (storedData) =>
  {
    const parsedData = JSON.parse(storedData)
    return parsedData === null || Date.now() - parsedData.storedTime > STALE_DATA_THRESHOLD
      ? null
      : parsedData.data
  }

const get = (key) =>
  AsyncStorage.getItem(DEFAULT_KEY_PREFIX + key)
    .then(unwrapDataFromStorage)
    .catch(console.error)

const store = (key, data) => {
  AsyncStorage.setItem(DEFAULT_KEY_PREFIX + key, wrapDataForStorage(data))
    .catch(console.error)
}

const remove = (key) =>
  AsyncStorage.removeItem(key)

export const getBusinessesFromStorage = () =>
  get(BUSINESS_KEY)

export const storeBusinessesToStorage = (businesses) =>
  store(BUSINESS_KEY, businesses)

export const removeBusinessesFromStorage = () =>
  remove(BUSINESS_KEY)
