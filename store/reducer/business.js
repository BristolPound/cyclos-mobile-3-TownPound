import { ListView } from 'react-native'
import haversine from 'haversine'
import merge from '../../util/merge'
import { getBusinesses } from '../../api'
import * as localStorage from '../../localStorage'

const isValidList = (businessList) => businessList !== null && businessList.length > 0
const storageKey = localStorage.storageKeys.BUSINESS_KEY

const initialState = {
  business: [],
  loading: true,
  refreshing: false,
  dataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.shortDisplay !== b.shortDisplay
  })
}

export const businessDetailsReceived = (business) =>
  (dispatch, getState) => dispatch({
    type: 'business/BUSINESS_DETAILS_RECEIVED',
    business,
    mapPosition: getState().map
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
      getBusinesses(dispatch)
        .catch((err) => {
          // do something with the response
          console.error(err)
        })
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


const sortBusinessesByLocation = (businesses, position) =>
businesses ?
  (position ?
    businesses
      .sort((a, b) => {
        if (!b.address) {
          return -1
        }
        if (!a.address) {
          return 1
        }
        a.distance = haversine(position, a.address.location)
        b.distance = haversine(position, b.address.location)
        return a.distance - b.distance
      }).filter(b =>
        b.address
        && Math.abs(b.address.location.latitude - position.latitude) < position.latitudeDelta
        && Math.abs(b.address.location.longitude - position.longitude) < position.longitudeDelta
      )
    : businesses)
  : []

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'business/BUSINESS_DETAILS_RECEIVED':
      const sorted = sortBusinessesByLocation(action.business, action.mapPosition)
      state = merge(state, {
        loading: false,
        dataSource: state.dataSource.cloneWithRows(sorted),
        business: sorted,
        refreshing: false,
        selected: sorted[0].id
      })
      break
    case 'business/UPDATE_REFRESHING':
      state = merge(state, {
        refreshing: true
      })
      break
    case 'business/BUSINESS_SELECTED':
      state = merge(state, {
        selected: action.selected
      })
      break
    case 'map/UPDATE_MAP':
      const sorted2 = sortBusinessesByLocation(state.business.slice(), action.params)
      state = merge(state, {
        business: sorted2,
        dataSource: state.dataSource.cloneWithRows(sorted2),
        selected: sorted2[0].id,
      })
      break
  }
  return state
}

export default reducer
