import { ListView } from 'react-native'
import merge from '../../util/merge'
import { getBusinesses } from '../../api'

const initialState = {
  business: [],
  loading: true,
  dataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.userName === b.userName
  })
}

export const businessDetailsReceived = (business) => ({
  type: 'business/BUSINESS_DETAILS_RECEIVED',
  business
})

export const loadBusinesses = () =>
    (dispatch) =>
        getBusinesses()
          .then(businesses => dispatch(businessDetailsReceived(businesses)))
          .catch(console.error)


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'business/BUSINESS_DETAILS_RECEIVED':
      state = merge(state, {
        loading: false,
        dataSource: state.dataSource.cloneWithRows(action.business),
        business: action.business
      })
      break
  }
  return state
}

export default reducer
