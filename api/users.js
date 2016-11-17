import { get } from './api'
import merge from '../util/merge'

const parseShortDisplay = fullDisplay =>
  fullDisplay.includes('(') ? fullDisplay.substring(fullDisplay.indexOf('(') + 1, fullDisplay.indexOf(')')) : fullDisplay

export const getBusinesses = (dispatch) =>
  get('users', {
    fields: [
      'id',
      'address.addressLine1',
      'address.addressLine2',
      'address.zip',
      'address.location',
      'image.url',
      'display',
      'shortDisplay',
      'username',
      'name'
    ],
    pageSize: 1000000,
    addressResult: 'primary',
    orderBy: 'alphabeticallyAsc'
  }, dispatch)
  .then(results => {
    // TODO: TEMPORARY FIX
    // remove when we are using one api and calls gives same values when logged in/out.
      // The prod api gives incorrect shortdisplay (format: DISPLAY (SHORTDISPLAY))
      // Also when logged in on either dev or prod the api uses username & name rather than shortDisplay and display
    if (results) {
      return results.map(bu => merge(bu, {
        display: bu.display || bu.name,
        shortDisplay: parseShortDisplay(bu.shortDisplay || bu.username),
        category: 'shop', // hardcoded pending database set up of categories.
      }))
    }
    return []
  })

export const getBusinessProfile = (businessId, dispatch) =>
  get('users/' + businessId, {
    fields: ['id', 'customValues']
  }, dispatch)

export const getAccountDetails = (dispatch) =>
  get('users/self', {
    fields: ['display', 'shortDisplay', 'image.url', 'email', 'phones']
  },
  dispatch)
