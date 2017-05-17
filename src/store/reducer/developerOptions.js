import { setBaseUrl } from '../../api/api'
import merge from '../../util/merge'
import Config from '@Config/config'


export const SERVER = {
  STAGE: Config.STAGE_SERVER,
  DEV: Config.DEV_SERVER
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
