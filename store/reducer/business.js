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
  visibleBusinesses: [],
  businessListExpanded: false,
  dataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.shortDisplay !== b.shortDisplay
  }),
  userLocation: { latitude: 51.455, longitude:  -2.588 },
  mapViewport: {
    latitude: 51.455,
    longitude: -2.588,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  },
  searchMode: false
}

export const expandBusinessList = (expand) => ({
  type: 'business/EXPAND_BUSINESS_LIST',
  expand
})

export const businessDetailsReceived = (business) => ({
    type: 'business/BUSINESS_DETAILS_RECEIVED',
    business
  })

export const updatePosition = (position) => ({
  type: 'business/POSITION_UPDATED',
  position
})

export const updateMapViewport = (viewport) => ({
  type: 'business/UPDATE_MAP_VIEWPORT',
  viewport
})

export const enableSearchMode = (enable) => ({
  type: 'business/SEARCH_MODE_ENABLED',
  enable
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

const distanceFromPosition = (position) => (business) =>
  business.address ? haversine(position, business.address.location) : Number.MAX_VALUE

const isWithinViewport = (position) => (business) =>
  business.address &&
  Math.abs(business.address.location.latitude - position.latitude) < position.latitudeDelta &&
  Math.abs(business.address.location.longitude - position.longitude) < position.longitudeDelta

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'business/BUSINESS_DETAILS_RECEIVED':
      const sortedBusiness = _.sortBy(action.business, distanceFromPosition(state.mapViewport))
      const filteredBusiness = sortedBusiness.filter(isWithinViewport(state.mapViewport))
      state = merge(state, {
        dataSource: state.dataSource.cloneWithRows(filteredBusiness),
        business: action.business,
        visibleBusinesses: action.business
      })
      break
    case 'business/UPDATE_MAP_VIEWPORT':
      const newViewport = merge(state.mapViewport, action.viewport)
      const sorted = _.sortBy(state.business, distanceFromPosition(newViewport))
      const filtered = sorted.filter(isWithinViewport(newViewport))
      state = merge(state, {
        dataSource: state.dataSource.cloneWithRows(filtered),
        mapViewport: newViewport,
        visibleBusinesses: filtered
      })
      break
    case 'business/POSITION_UPDATED':
      state = merge(state, {
        userLocation: action.position
      })
      break
    case 'business/EXPAND_BUSINESS_LIST':
      state = merge(state, {
        businessListExpanded: action.expand
      })
      break
    case 'business/SEARCH_MODE_ENABLED':
      state = merge(state, {
        searchMode: action.enable,
        dataSource: action.enable
          ? state.dataSource.cloneWithRowsAndSections({
                closest: state.visibleBusinesses,
              },
              [ 'closest' ]
            )
            : state.dataSource.cloneWithRows(state.visibleBusinesses),
        businessListExpanded: action.enable
      })
  }
  return state
}

export default reducer
