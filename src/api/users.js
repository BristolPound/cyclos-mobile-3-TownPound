import Config from '@Config/config'
import { get } from './api'
import merge from '../util/merge'

const DirectoryAPI = require('org.bristolpound.cyclos.api.directory')

const directoryAPI = new DirectoryAPI(merge(Config.DIRECTORY, {apiVersion: '0.3'}))

const parseShortDisplay = fullDisplay =>
  fullDisplay.includes('(') ? fullDisplay.substring(fullDisplay.indexOf('(') + 1, fullDisplay.indexOf(')')) : fullDisplay

export const getBusinesses = () =>
	directoryAPI.staticDirectory()
	.then(data => data)

export const getAccountDetails = (dispatch) =>
  get('users/self', {
    fields: ['display', 'shortDisplay', 'image.url', 'email', 'phones'],
    requiresAuthorisation: true
  }, dispatch)
  .then(account => merge(account, {
    display: account.display || account.name,
    shortDisplay: parseShortDisplay(account.shortDisplay || account.username)
  }))
