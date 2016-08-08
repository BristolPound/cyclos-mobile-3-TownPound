import { combineReducers } from 'redux'

import transaction from './reducer/transaction'
import navigation from './reducer/navigation'

const reducer = combineReducers({
  transaction,
  navigation
})

export default reducer
