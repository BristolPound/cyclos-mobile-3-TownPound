import { ListView } from 'react-native'
import merge from '../../util/merge'
import { getBusinesses } from '../../api'
import { getBusinessesFromStorage, storeBusinessesToStorage, removeBusinessesFromStorage } from '../../localStorage'

const unexceptableBusinessList = (businessList) => businessList === null || businessList.length === 0

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

export const resetState = () => ({
  type: 'business/RESET_STATE'
})

export const loadBusinesses = () =>
    (dispatch) =>
      getBusinessesFromStorage()
        .then(storedBusinesses => {
          if (unexceptableBusinessList(storedBusinesses)) {
            dispatch(loadBusinessesFromApi())
          }
          else{
            dispatch(businessDetailsReceived(storedBusinesses))
          }
        })

const loadBusinessesFromApi = () =>
    (dispatch) =>
      getBusinesses()
        .then(businesses => {
          if (!unexceptableBusinessList(businesses)) {
            storeBusinessesToStorage(businesses)
          }
          dispatch(businessDetailsReceived(businesses))
        })
        .catch(console.error)

export const refreshBusinesses = () =>
  (dispatch) =>
    {
      dispatch(resetState())
      removeBusinessesFromStorage()
      dispatch(loadBusinessesFromApi())
    }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'business/BUSINESS_DETAILS_RECEIVED':
      state = merge(state, {
        loading: false,
        dataSource: state.dataSource.cloneWithRows(action.business),
        business: action.business
      })
      break
    case 'business/RESET_STATE':
      state = merge(state, {
        loading: true,
        business: []
      })
      break
  }
  return state
}

export default reducer
