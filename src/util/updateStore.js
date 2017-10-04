import { updateVersion, resetStore } from '../store/reducer/storeVersion'
import Config from '@Config/config'

const STORE_VERSION = 0

export default updateStoreVersion = (store) => {
  const currentStoreVersion = store.getState().storeVersion.version

  console.log("the current store version is " + currentStoreVersion)

  if (!currentStoreVersion) {
    store.dispatch(updateVersion(STORE_VERSION))
    return true
  }


  // For dev purposes - if a reset version is set and it's greater than the
  // current version, clear out and reset the store as specified in the
  // reducers, then set the version to the STORE_VERSION
  if (__DEV__ && Config.resetVersion && currentStoreVersion < Config.resetVersion) {
    purgeStoredState({storage: AsyncStorage})
    store.dispatch(resetStore())
    store.dispatch(updateVersion(STORE_VERSION))
    return true
  }

  if (currentStoreVersion === STORE_VERSION) {
    return false
  }

  // Perform all of the update sequences in order starting from the
  // current store version, then set the version to the new STORE_VERSION
  switch (currentStoreVersion) {
    case 0:
      // Get the loggedInUsername and put it in the object/array
      // of previously logged in usernames with blank access token etc.

    default:
      store.dispatch(updateVersion(STORE_VERSION))
  }

  return true


}
