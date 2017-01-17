import haversine from 'haversine'
import _ from 'lodash'
import moment from 'moment'
import merge from '../../util/merge'
import { getClosestBusinesses, offsetOverlappingBusinesses } from '../../util/business'
import { addFailedAction } from './networkConnection'
import { getBusinesses, getBusinessProfile } from '../../api/users'
import { UNEXPECTED_DATA } from '../../api/apiError'
import { ERROR_SEVERITY, unknownError, updateStatus } from './statusMessage'

const DEFAULT_COORDINATES = { latitude: 51.454513, longitude:  -2.58791 }

const MapViewport = {
    ...DEFAULT_COORDINATES,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006
}

const Business = {
  businessList: [],
  businessListTimestamp: null,
  selectedBusinessId: undefined,
  closestBusinesses: [],
  mapViewport: MapViewport,
  forceRegion: MapViewport,
  searchMode: false,
  traderScreenBusinessId: undefined,
  geolocationStatus: null
}

export const businessListReceived = (businessList) => ({
  type: 'business/BUSINESS_LIST_RECEIVED',
  businessList
})

export const moveMap = () => ({
  type: 'business/MOVE_MAP'
})

export const businessProfileReceived = (businessProfile) => ({
  type: 'business/BUSINESS_PROFILE_RECEIVED',
  businessProfile
})

export const updateMapViewport = (viewport) => ({
  type: 'business/UPDATE_MAP_VIEWPORT',
  viewport
})

export const updateMapViewportAndSelectClosestTrader = (viewport) => ({
  type: 'business/UPDATE_MAP_VIEWPORT_AND_SELECT_CLOSEST_TRADER',
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

export const geolocationChanged = (coords, dispatch) => {
    dispatch(geolocationSuccess(coords))
    //furthest business is around 70km from Bristol centre
    if (haversine(DEFAULT_COORDINATES, coords) < 75) {
        dispatch(updateMapViewportAndSelectClosestTrader(coords))
        dispatch(moveMap())
    }
}

export const geolocationFailed = () => ({
  type: 'business/GEOLOCATION_FAILED'
})

export const loadBusinessProfile = (businessId) => (dispatch) => {
  getBusinessProfile(businessId, dispatch)
    .then(businessProfile => dispatch(businessProfileReceived(businessProfile)))
    // if this request fails, the modal trader screen will continue to show a spinner
    // but will be closeable
    .catch(err => {
      dispatch(addFailedAction(loadBusinessProfile(businessId)))
      if (err.type === UNEXPECTED_DATA) {
        dispatch(updateStatus('Business no longer exists', ERROR_SEVERITY.SEVERE))
        dispatch(loadBusinessList(true))
      } else {
        dispatch(unknownError(err))
      }
    })
}

export const selectAndLoadBusiness = (businessId) => (dispatch, getState) => {
  dispatch(selectBusinessForModal(businessId))
  // check to see whether we actually need to load the profile
  const businessList = getState().business.businessList
  const business = businessList.find(b => b.id === businessId)
  if (!business.profilePopulated && getState().networkConnection.status) {
    dispatch(loadBusinessProfile(businessId))
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

const reducer = (state = Business, action) => {
  switch (action.type) {
    case 'business/BUSINESS_LIST_RECEIVED':
      const offsetBusinesses = offsetOverlappingBusinesses(action.businessList).map(business => merge(business, {colorCode: 0}))
      let closestBusinesses = getClosestBusinesses(action.businessList, state.mapViewport)
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
      closestBusinesses = getClosestBusinesses(state.businessList, newViewport)
      state = merge(state, {
        mapViewport: newViewport,
        closestBusinesses
      })
      break

    case 'business/UPDATE_MAP_VIEWPORT_AND_SELECT_CLOSEST_TRADER':
      // newViewport is declared in UPDATE_MAP_VIEWPORT case
      newViewport = merge(state.mapViewport, action.viewport) // action.viewport might only be partial (no deltas)

      // Since we wish to update the selected trader, allow the closest to be at the top of the list
      closestBusinesses = getClosestBusinesses(state.businessList, newViewport)

      let newSelectedId = state.selectedBusinessId
      // If there is at least one business on the list, make the first business the new selected business
      if (closestBusinesses.length) {
        newSelectedId = closestBusinesses[0].id
      }

      state = merge(state, {
        closestBusinesses,
        mapViewport: newViewport,
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

    case 'business/MOVE_MAP':
      state = merge(state, { forceRegion: state.mapViewport })
      break
  }
  return state
}

export default reducer
