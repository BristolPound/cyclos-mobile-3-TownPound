import { ListView } from 'react-native'
import merge from '../../util/merge'
import { getBusinesses } from '../../api'
import * as localStorage from '../../localStorage'

const acceptableBusinessList = (businessList) => businessList !== null && businessList.length > 0
const storageKey = localStorage.storageKeys.BUSINESS_KEY

const initialState = {
  business: [],
  loading: true,
  refreshing: false,
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
      localStorage.get(storageKey)
        .then(storedBusinesses => {
          if (!acceptableBusinessList(storedBusinesses)) {
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
          if (acceptableBusinessList(businesses)) {
            localStorage.save(storageKey, businesses)
          }
          dispatch(businessDetailsReceived(businesses))
        })
        .catch(console.error)

export const refreshBusinesses = () =>
  (dispatch) =>
    {
      dispatch(resetState())
      localStorage.remove(storageKey)
      dispatch(loadBusinessesFromApi())
    }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'business/BUSINESS_DETAILS_RECEIVED':
      state = merge(state, {
        loading: false,
        dataSource: state.dataSource.cloneWithRows(action.business),
        business: action.business,
        refreshing: false
      })
      break
    case 'business/RESET_STATE':
      state = merge(state, {
        refreshing: true
      })
      break
  }
  return state
}

export default reducer
