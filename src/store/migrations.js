import * as business from './reducer/business'

const migrations = {

  // Perform all of the update sequences in order starting from the
  // current store version, then set the version to the new STORE_VERSION

  1: (state) => {
    // migration clear out device state
    return {
      ...state,
      business: business.initialState,
    }
  },
}

export default migrations
