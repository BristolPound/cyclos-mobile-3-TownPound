import haversine from 'haversine'
import _ from 'lodash'
import moment from 'moment'
import { Dimensions } from 'react-native'
import merge from '../../util/merge'
import { getClosestBusinesses, offsetOverlappingBusinesses, getBusinessesByFilter, getBusinessesByExclusiveFilter } from '../../util/business'
import { addFailedAction } from './networkConnection'
import { getBusinesses } from '../../api/users'
import { UNEXPECTED_DATA } from '../../api/apiError'
import { ERROR_SEVERITY, unknownError, updateStatus } from './statusMessage'
import { showModal, modalState } from './navigation'
import { updatePayee } from './sendMoney'
import Config from '@Config/config'

const DEFAULT_COORDINATES = { latitude: 51.454513, longitude:  -2.58791 }

// 1 pixel right adds the same to longitude as 1.69246890879 pixels up adds to latitude
// when the map is centred at the default coordinates
const longitudePerLatitude = 1.69246890879

// Map sticks up above and below the visible area because we don't want the buttons and logo
export const mapOverflow = 70

const { height, width } = Dimensions.get('window')
export const mapHeight = height + 95
const mapWidth = width

export const MapViewport = {
    ...DEFAULT_COORDINATES,
    longitudeDelta: 0.006,
    latitudeDelta: 0.006 * mapHeight / (mapWidth * longitudePerLatitude),
}

export const tabModes = {
  default: 'default',
  filter: 'filter',
  serach: 'search'
}

export const allFilters = [
  {
    label: 'foodanddrink',
    text: "Food And Drink"
  },
  {
    label: 'foryourbusiness',
    text: "For your business"
  },
  {
    label: 'foryourhome',
    text: "For your home"
  },
  {
    label: 'gettingaround',
    text: "Getting around"
  },
  {
    label: 'goingout',
    text: "Going out"
  },
  {
    label: 'lookingafteryou',
    text: "Looking after you"
  },
  {
    label: 'shopping',
    text: "Shopping"
  },
  {
    label: 'visitingthecity',
    text: "Visiting " + Config.APP_CITY
  }
]

// We want the center for sorting businesses higher than the actual centre of map.
// 1/15 of mapHeight higher than center of map, which is 22.5px higher than center of screen.
// So in total around 60 - 70 px higher than screen centre
const mapCenterModifier = 1 / 15
const centerViewportHigher = (viewport) =>
  merge(viewport, { latitude: viewport.latitude + viewport.latitudeDelta * mapCenterModifier })
// When moving the map, give it a center with lower latitude so that the
// chosen location appears higher on the screen
const centerViewportLower = (viewport) =>
  merge(viewport, { latitude: viewport.latitude - viewport.latitudeDelta * mapCenterModifier })

// returns relevant part of viewport for business list
const businessArea = (viewport) =>
  merge(viewport, {
    latitudeDelta: viewport.latitudeDelta * (height / (height + mapOverflow * 2) - 2 * mapCenterModifier)
  })

const initialState = {
  businessList: [],
  businessListTimestamp: null,
  selectedBusinessId: undefined,
  closestBusinesses: [],
  activeFilters: [],
  filteredBusinesses: [],
  mapViewport: MapViewport,
  forceRegion: MapViewport,
  tabMode: tabModes.default,
  traderScreenBusinessId: undefined,
  geolocationStatus: null,
  businessListRef: null,
}

export const businessListReceived = (businessList) => ({
  type: 'business/BUSINESS_LIST_RECEIVED',
  businessList
})

export const registerBusinessList = (ref) => ({
  type: 'business/REGISTER_BUSINESS_LIST',
  ref
})

export const updateMapViewport = (viewport) => ({
  type: 'business/UPDATE_MAP_VIEWPORT',
  viewport
})

export const moveMap = (viewport) => ({
  type: 'business/MOVE_MAP',
  viewport
})

export const updateTabMode = (mode) => ({
    type: 'business/UPDATE_TAB_MODE',
    mode
})

export const resetBusinesses = () => ({
  type: 'business/RESET_BUSINESSES',
})

const selectBusinessForModal = (id) => ({
  type: 'business/SET_TRADER_SCREEN_ID',
  id
})

export const addFilter = (value) => (dispatch) =>
  dispatch({
      type: 'business/ADD_FILTER',
      value
  })

export const removeFilter = (value) => (dispatch) =>
  dispatch({
      type: 'business/REMOVE_FILTER',
      value
  })

export const selectBusiness = (businessId) => (dispatch) =>
  dispatch({
      type: 'business/SELECTED_BUSINESS',
      businessId
  })

export const geolocationSuccess = (location) => ({
  type: 'business/GEOLOCATION_SUCCESS',
  location
})

export const selectClosestBusiness = () => ({
  type: 'business/SELECT_CLOSEST_BUSINESS'
})

export const geolocationChanged = (coords, dispatch) => {
    const { latitude, longitude } = coords
    dispatch(geolocationSuccess(coords))
    //furthest business is around 70km from Bristol centre
    if (haversine(DEFAULT_COORDINATES, coords) < 75) {
        dispatch(moveMap({ latitude, longitude }))
        dispatch(selectClosestBusiness())
    }
}

export const geolocationFailed = () => ({
  type: 'business/GEOLOCATION_FAILED'
})

export const openTraderModal = (businessId) => (dispatch, getState) => {
  dispatch(selectBusinessForModal(businessId))
  dispatch(showModal(modalState.traderScreen))
  dispatch(updatePayee(businessId))
}

export const loadBusinessList = (force = false) => (dispatch, getState) => {
    const persistedDate = getState().business.businessListTimestamp
    //ToDo: to load data every time! When api has changed make a call to check whether something changed since last time the data was pulled
    if (true || Date.now() - persistedDate > moment.duration(2, 'days') || force) {
      getBusinesses()
        .then((businesses) => {
          dispatch(businessListReceived(businesses))
        })
        // if this request fails, the business list may not be populated. In this case, when
        // connection status changes to be connected, the list is re-fetched
        .catch((err) => {
          dispatch(addFailedAction(loadBusinessList(force)))
          dispatch(unknownError(err))
        })
    } else {
      dispatch(businessListReceived(getState().business.businessList))
    }
  }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'business/BUSINESS_LIST_RECEIVED':
      const offsetBusinesses = offsetOverlappingBusinesses(action.businessList)
      const businesses = action.businessList
      let closestBusinesses = getClosestBusinesses(businesses, businessArea(centerViewportHigher(state.mapViewport)))
      state = merge(state, {
        closestBusinesses,
        businessList: offsetBusinesses,
        businessListTimestamp: new Date()
      })
      break

    case 'business/UPDATE_MAP_VIEWPORT':
      let newViewport = merge(state.mapViewport, action.viewport) // action.viewport might only be partial (no deltas)
      // closestBusinesses is declared in the first switch case so we cannot define it here. Blame javascript!
      businesses = state.filteredBusinesses.length > 0 ? state.filteredBusinesses : state.businessList
      closestBusinesses = getClosestBusinesses(businesses, businessArea(centerViewportHigher(newViewport)))
      // state.businessListRef && state.businessListRef.scrollAndSlideTo(1)
      // ^ resets the list to position 1 (even if the list was closed)
      state = merge(state, {
        mapViewport: newViewport,
        closestBusinesses
      })
      break

    case 'business/MOVE_MAP':
      // newViewport is declared in UPDATE_MAP_VIEWPORT case
      newViewport = merge(state.mapViewport, action.viewport) // action.viewport might only be partial (no deltas)

      // Since we wish to update the selected trader, allow the closest to be at the top of the list
      businesses = state.filteredBusinesses.length > 0 ? state.filteredBusinesses : state.businessList
      closestBusinesses = getClosestBusinesses(businesses, businessArea(newViewport))

      state = merge(state, {
        closestBusinesses,
        mapViewport: centerViewportLower(newViewport),
        forceRegion: centerViewportLower(newViewport),
      })
      break

    case 'business/SELECT_CLOSEST_BUSINESS':
      let newSelectedId = state.selectedBusinessId
      // If there is at least one business on the list, make the first business the new selected business
      if (state.closestBusinesses.length) {
        newSelectedId = state.closestBusinesses[0].id
      }
      state = merge(state, {
        selectedBusinessId: newSelectedId
      })
      break

    case 'business/SELECTED_BUSINESS':
      state = merge(state, {
        selectedBusinessId: action.businessId,
      })
      break

    case 'business/RESET_BUSINESSES':
      state = merge(state, {
        businessList: [],
        businessListTimestamp: null,
        closestBusinesses: [ ],
        traderScreenBusinessId: undefined
      })
      break

    case 'business/SET_TRADER_SCREEN_ID':
      state = merge(state, {
        traderScreenBusinessId: action.id,
      })
      break

    case 'business/ADD_FILTER':
      let newActiveFilters = state.activeFilters
      newActiveFilters.push(action.value)
      let newFilteredBusinesses = _.union(getBusinessesByFilter(state.businessList, action.value), state.filteredBusinesses)
      closestBusinesses = getClosestBusinesses(newFilteredBusinesses, businessArea(state.mapViewport))
      state = merge(state, {
        closestBusinesses,
        activeFilters: newActiveFilters,
        filteredBusinesses: newFilteredBusinesses
      })
      break

    case 'business/REMOVE_FILTER':
      newActiveFilters = state.activeFilters
      _.pull(newActiveFilters, action.value)
      newFilteredBusinesses = _.difference(state.filteredBusinesses, getBusinessesByExclusiveFilter(state.businessList, newActiveFilters, action.value))
      businesses = state.filteredBusinesses.length > 0 ? state.filteredBusinesses : state.businessList
      closestBusinesses = getClosestBusinesses(businesses, businessArea(state.mapViewport))
      state = merge(state, {
        closestBusinesses,
        activeFilters: newActiveFilters,
        filteredBusinesses: newFilteredBusinesses
      })
      break

    case 'business/UPDATE_TAB_MODE':
      state = merge(state, { tabMode: action.mode })
      break

    case 'business/GEOLOCATION_FAILED':
      state = merge(state, { geolocationStatus: false })
      break

    case 'business/GEOLOCATION_SUCCESS':
      state = merge(state, { geolocationStatus: action.location })
      break

    case 'business/REGISTER_BUSINESS_LIST':
      state = merge(state, { businessListRef: action.ref })
      break

    case 'navigation/NAVIGATE_TO_TAB':
      state = merge(state, { tabMode: tabModes.default })
  }
  return state
}

export default reducer
