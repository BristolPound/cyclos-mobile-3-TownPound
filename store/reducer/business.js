import { ListView } from 'react-native'
import merge from '../../util/merge'
import { getBusinesses, getAddresses } from '../../api'
import * as localStorage from '../../localStorage'
import { selectClosestBusinessId } from './position'

const isValidList = (businessList) => businessList !== null && businessList.length > 0
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

const updateRefreshing = () => ({
  type: 'business/UPDATE_REFRESHING'
})

export const loadBusinesses = () =>
    (dispatch) =>
      localStorage.get(storageKey)
        .then(storedBusinesses => {
          if (!isValidList(storedBusinesses)) {
            dispatch(loadBusinessesFromApi())
          } else {
            dispatch(businessDetailsReceived(storedBusinesses))
          }
        })

const loadBusinessesFromApi = () =>
    (dispatch) =>
      getBusinesses()
        .then(businesses => {
          if (isValidList(businesses)) {
            localStorage.save(storageKey, businesses)
          }
          dispatch(businessDetailsReceived(businesses))
        })
        .catch(console.error)

export const refreshBusinesses = () =>
  (dispatch) => {
      dispatch(updateRefreshing())
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
    case 'business/UPDATE_REFRESHING':
      state = merge(state, {
        refreshing: true
      })
      break
    case 'position/POSITION_UPDATED':
      const closestId = selectClosestBusinessId(state.business, action.position)
      state = merge(state, {
        selected: closestId
      })
      break
    case 'business/BUSINESS_SELECTED':
      state = merge(state, {
        selected: action.selected
      })
      break
  }
  return state
}

export default reducer
