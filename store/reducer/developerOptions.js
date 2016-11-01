import { setBaseUrl } from '../../api/api'
import merge from '../../util/merge'

export const SERVER = {
  STAGE: 'https://bristol-stage.community-currency.org/cyclos/api/',
  DEV: 'https://bristol.cyclos.org/bristolpoundsandbox03/api/'
}

const initialState = {
  server: SERVER.STAGE
}

export const selectServer = (serverId) => ({
  type: 'developerOptions/SELECT_SERVER',
  serverId
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'developerOptions/SELECT_SERVER':
      const server = SERVER[action.serverId]
      setBaseUrl(server)
      state = merge(state, {
        server
      })
      break
  }
  return state
}

export default reducer
