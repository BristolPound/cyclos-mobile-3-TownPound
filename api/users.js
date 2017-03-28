import { get } from './api'
import merge from '../util/merge'

const DirectoryAPI = require('org.bristolpound.cyclos.api.directory')

const directoryAPI = new DirectoryAPI({
	  host: 'bristol-stage.community-currency.org'
	, network: 'bristolpound'
})


const parseShortDisplay = fullDisplay =>
  fullDisplay.includes('(') ? fullDisplay.substring(fullDisplay.indexOf('(') + 1, fullDisplay.indexOf(')')) : fullDisplay

export const getBusinesses = () =>
	directoryAPI.directory()
	.then(data => {
    console.log(data)
    return data.directory}
    )

export const getAccountDetails = (dispatch) =>
  get('users/self', {
    fields: ['display', 'shortDisplay', 'image.url', 'email', 'phones'],
    requiresAuthorisation: true
  }, dispatch)
  .then(account => merge(account, {
    display: account.display || account.name,
    shortDisplay: parseShortDisplay(account.shortDisplay || account.username)
  }))
