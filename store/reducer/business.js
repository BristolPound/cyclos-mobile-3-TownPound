import haversine from 'haversine'
import _ from 'lodash'
import moment from 'moment'
import { Dimensions } from 'react-native'
import merge from '../../util/merge'
import { getClosestBusinesses, offsetOverlappingBusinesses } from '../../util/business'
import { addFailedAction } from './networkConnection'
import { getBusinesses, getBusinessProfile } from '../../api/users'
import { UNEXPECTED_DATA } from '../../api/apiError'
import { ERROR_SEVERITY, unknownError, updateStatus } from './statusMessage'
import { showModal, modalState } from './navigation'
import { updatePayee } from './sendMoney'

const DEFAULT_COORDINATES = { latitude: 51.454513, longitude:  -2.58791 }

// 1 pixel right adds the same to longitude as 1.69246890879 pixels up adds to latitude
// when the map is centred at the default coordinates
const longitudePerLatitude = 1.69246890879

// Map sticks up above and below the visible area because we don't want the buttons and logo
export const mapOverflow = 70

const { height, width } = Dimensions.get('window')
export const mapHeight = height + 95
const mapWidth = width

const MapViewport = {
    ...DEFAULT_COORDINATES,
    longitudeDelta: 0.006,
    latitudeDelta: 0.006 * mapHeight / (mapWidth * longitudePerLatitude),
}

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
  mapViewport: MapViewport,
  forceRegion: MapViewport,
  searchMode: false,
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

export const businessProfileReceived = (businessProfile) => ({
  type: 'business/BUSINESS_PROFILE_RECEIVED',
  businessProfile
})

export const updateMapViewport = (viewport) => ({
  type: 'business/UPDATE_MAP_VIEWPORT',
  viewport
})

export const moveMap = (viewport) => ({
  type: 'business/MOVE_MAP',
  viewport
})

export const updateSearchMode = (mode) => ({
    type: 'business/UPDATE_SEARCH_MODE',
    mode
})

export const resetBusinesses = () => ({
  type: 'business/RESET_BUSINESSES',
})

const selectBusinessForModal = (id) => ({
  type: 'business/SET_TRADER_SCREEN_ID',
  id
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

export const loadBusinessProfile = (businessId) => (dispatch) => {
  getBusinessProfile(businessId, dispatch)
    .then(businessProfile => {
      dispatch(businessProfileReceived(businessProfile))
      dispatch(showModal(modalState.traderScreen))
      dispatch(updatePayee(businessId))
    })
    .catch(err => {
      if (err.type === UNEXPECTED_DATA) {
        dispatch(updateStatus('Business no longer exists', ERROR_SEVERITY.SEVERE))
        dispatch(loadBusinessList(true))
      } else {
        dispatch(unknownError(err))
      }
    })
}

export const openTraderModal = (businessId) => (dispatch, getState) => {
  dispatch(selectBusinessForModal(businessId))
  // check to see whether we actually need to load the profile
  const businessList = getState().business.businessList
  const business = businessList.find(b => b.id === businessId)
  if (!business.profilePopulated && getState().networkConnection.status) {
    dispatch(loadBusinessProfile(businessId))
  } else {
    dispatch(showModal(modalState.traderScreen))
    dispatch(updatePayee(businessId))
  }
}

export const loadBusinessList = (force = false) => (dispatch, getState) => {
    const persistedDate = getState().business.businessListTimestamp
    if (Date.now() - persistedDate > moment.duration(2, 'days') || force) {
      getBusinesses(dispatch)
        .then(businesses => dispatch(businessListReceived(businesses)))
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
      const offsetBusinesses = offsetOverlappingBusinesses(action.businessList).map(business => merge(business, {colorCode: 0}))
      let closestBusinesses = getClosestBusinesses(action.businessList, businessArea(centerViewportHigher(state.mapViewport)))
      state = merge(state, {
        closestBusinesses,
        businessList: offsetBusinesses,
        businessListTimestamp: new Date()
      })
      break

    case 'business/BUSINESS_PROFILE_RECEIVED':
      const index  = _.findIndex(state.businessList, {id: action.businessProfile.id})

      let additionalFields = {}
      if (action.businessProfile.customValues) {
        additionalFields = _.fromPairs(
          _.map(action.businessProfile.customValues, fieldEntry => [
            fieldEntry.field.internalName,
            fieldEntry.stringValue
          ])// shape: list of 2-element lists ([[name, value],[name1, value1], ...])
        ) // turns into object from key-value pairs ({name:value, name1:value1})
      }

      const updatedBusiness = merge(
        state.businessList[index],
        {profilePopulated: true},
        action.businessProfile,
        additionalFields
      )
      const newBusinessList = [
        ..._.slice(state.businessList, 0, index),
        updatedBusiness,
        ..._.slice(state.businessList, index + 1)
      ]
      state = merge(state, {
        businessList: newBusinessList
      })
      break

    case 'business/UPDATE_MAP_VIEWPORT':
      let newViewport = merge(state.mapViewport, action.viewport) // action.viewport might only be partial (no deltas)
      // closestBusinesses is declared in the first switch case so we cannot define it here. Blame javascript!
      closestBusinesses = getClosestBusinesses(state.businessList, businessArea(centerViewportHigher(newViewport)))
      state = merge(state, {
        mapViewport: newViewport,
        closestBusinesses
      })
      break

    case 'business/MOVE_MAP':
      // newViewport is declared in UPDATE_MAP_VIEWPORT case
      newViewport = merge(state.mapViewport, action.viewport) // action.viewport might only be partial (no deltas)

      // Since we wish to update the selected trader, allow the closest to be at the top of the list
      closestBusinesses = getClosestBusinesses(state.businessList, businessArea(newViewport))

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

    case 'business/UPDATE_SEARCH_MODE':
      state = merge(state, { searchMode: action.mode })
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
      state = merge(state, { searchMode: false })
  }
  return state
}

export default reducer
