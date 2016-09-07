/*
  Wrapper for AsyncStorage to consistently log errors and to hide stale data thresholds.
  Note: AsyncStorage is unencryted and should only be used for light storage.
*/

import { AsyncStorage } from 'react-native'

const DEFAULT_KEY_PREFIX = '@BristolPoundStore:'
export const storageKeys = {
  BUSINESS_KEY: 'BUSINESSES',
  TRANSACTION_KEY: 'TRANSACTION'
}
const STALE_DATA_THRESHOLD = 24 * 60 * 60 * 1000 //TODO: find out what we want here. Currently: milliseconds in a day

const wrapDataForStorage = (dataToStore) =>
  JSON.stringify({
    storedTime: Date.now(),
    data: dataToStore
  })

const unwrapDataFromStorage = (storedData) => {
    const parsedData = JSON.parse(storedData)
    return parsedData === null || Date.now() - parsedData.storedTime > STALE_DATA_THRESHOLD
      ? null
      : parsedData.data
  }

export const get = (key) =>
  AsyncStorage.getItem(DEFAULT_KEY_PREFIX + key)
    .then(unwrapDataFromStorage)
    .catch(console.error)

export const save = (key, data) => {
  AsyncStorage.setItem(DEFAULT_KEY_PREFIX + key, wrapDataForStorage(data))
    .catch(console.error)
}

export const remove = (key) =>
  AsyncStorage.removeItem(DEFAULT_KEY_PREFIX + key)
