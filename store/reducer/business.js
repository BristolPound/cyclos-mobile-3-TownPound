import { ListView } from 'react-native'
import haversine from 'haversine'
import _ from 'lodash'
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

const distanceFromPosition = (position) => (business) =>
  business.address ? haversine(position, business.address.location) : Number.MAX_VALUE

const isWithinViewport = (position) => (business) =>
  business.address &&
  Math.abs(business.address.location.latitude - position.latitude) < position.latitudeDelta &&
  Math.abs(business.address.location.longitude - position.longitude) < position.longitudeDelta

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'business/BUSINESS_DETAILS_RECEIVED':
      state = merge(state, {
        loading: false,
        dataSource: state.dataSource.cloneWithRows(action.business),
        business: action.business,
        refreshing: false,
        selected: action.business[0].id
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
    case 'map/UPDATE_MAP_VIEWPORT':
      const sorted = _.sortBy(state.business, distanceFromPosition(action.params))
      const filtered = sorted.filter(isWithinViewport(action.params))
      state = merge(state, {
        dataSource: state.dataSource.cloneWithRows(filtered),
        selected: filtered.length > 0 ? filtered[0].id : undefined,
      })
      break
  }
  return state
}

export default reducer
