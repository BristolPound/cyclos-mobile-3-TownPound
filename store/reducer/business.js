import { ListView } from 'react-native'
import haversine from 'haversine'
import _ from 'lodash'
import moment from 'moment'
import merge from '../../util/merge'
import { addFailedAction } from './networkConnection'
import { getBusinesses, getBusinessProfile } from '../../api/users'

const DEFAULT_LOCATION =  { latitude: 51.454513, longitude:  -2.58791 }

const initialState = {
  businessList: [],
  businessListTimestamp: null,
  businessListExpanded: false,
  selectedBusinessId: undefined,
  businessListDataSource: new ListView.DataSource({
    rowHasChanged: (a, b) => a.shortDisplay !== b.shortDisplay,
    sectionHeaderHasChanged: (a, b) => a !== b
  }),
  businessesToDisplay: [ ],
  mapViewport: {
    ...DEFAULT_LOCATION,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006
  },
  searchMode: false
}

export const expandBusinessList = (expand) => ({
  type: 'business/EXPAND_BUSINESS_LIST',
  expand
})

export const businessListReceived = (businessList) => ({
  type: 'business/BUSINESS_LIST_RECEIVED',
  businessList
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

export const selectBusiness = (businessId) => (dispatch) =>
  dispatch({
    type: 'business/SELECTED_BUSINESS',
    businessId
  })

export const resetBusinesses = () => ({
  type: 'business/RESET_BUSINESSES',
})

export const geolocationChanged = (coords, dispatch) => {
  if (haversine(DEFAULT_LOCATION, coords) < 75) {//furthest business is around 70km from Bristol centre
    dispatch(updateMapViewportAndSelectClosestTrader(coords))
  }
}

export const loadBusinessProfile = (businessId) =>
  (dispatch) =>
    getBusinessProfile(businessId, dispatch)
      .then(businessProfile => dispatch(businessProfileReceived(businessProfile)))
      // if this request fails, the modal trader screen will continue to show a spinner
      // but will be closeable
      .catch(err => {
        dispatch(addFailedAction(loadBusinessProfile(businessId)))
        console.warn(err)
      })

export const selectAndLoadBusiness = (businessId) =>
  (dispatch, getState) => {
    dispatch(selectBusiness(businessId))

    // check to see whether we actually need to load the profile
    const businessList = getState().business.businessList
    const business = businessList.find(b => b.id === businessId)
    if (!business.profilePopulated) {
      dispatch(loadBusinessProfile(businessId))
    }
  }

export const loadBusinessList = (force = false) =>
  (dispatch, getState) => {
    const persistedDate = getState().business.businessListTimestamp
    if (Date.now() - persistedDate > moment.duration(2, 'days') || force) {
      getBusinesses(dispatch)
        .then(businesses => dispatch(businessListReceived(businesses)))
        // if this request fails, the business list may not be populated. In this case, when
        // connection status changes to be connected, the list is re-fetched
        .catch(err => {
          dispatch(addFailedAction(loadBusinessList(force)))
          console.warn(err)
        })
    }
  }

// selectedBusinessId is optional
const getBusinessesToDisplay = (list, viewport, selectedBusinessId) =>
  _.sortBy(
    list.filter(shouldBeDisplayed(viewport, selectedBusinessId)),
    orderBusinessList(viewport, selectedBusinessId)
  )


const orderBusinessList = (viewport, selectedBusinessId) => (business) => {
  if (business.address) {
    return business.id === selectedBusinessId ? -1 : haversine(viewport, business.address.location)
  }
  return Number.MAX_VALUE
}

const isWithinViewport = (business, viewport) =>
  business.address
    && Math.abs(business.address.location.latitude - viewport.latitude) < viewport.latitudeDelta / 2
    && Math.abs(business.address.location.longitude - viewport.longitude) < viewport.longitudeDelta / 2

const shouldBeDisplayed = (viewport, selectedBusinessId) => (business) =>
  business.id === selectedBusinessId || isWithinViewport(business, viewport)

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'business/BUSINESS_LIST_RECEIVED':
      let businessesToDisplay = getBusinessesToDisplay(action.businessList, state.mapViewport, state.selectedBusinessId)
      state = merge(state, {
        businessListDataSource: state.businessListDataSource.cloneWithRows(businessesToDisplay),
        businessesToDisplay,
        businessList: action.businessList,
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

      // businessesToDisplay is defined in the first switch case so we cannot define it here. Blame javascript!
      businessesToDisplay = getBusinessesToDisplay(state.businessList, newViewport, state.selectedBusinessId)

      state = merge(state, {
        mapViewport: newViewport,
        businessListDataSource: state.businessListDataSource.cloneWithRows(businessesToDisplay),
        businessesToDisplay
      })
      break

    case 'business/UPDATE_MAP_VIEWPORT_AND_SELECT_CLOSEST_TRADER':
      // newViewport is defined in UPDATE_MAP_VIEWPORT case
      newViewport = merge(state.mapViewport, action.viewport) // action.viewport might only be partial (no deltas)

      // Since we wish to update the selected trader, allow the closest to be at the top of the list
      businessesToDisplay = getBusinessesToDisplay(state.businessList, newViewport)

      let newSelectedId = state.selectedBusinessId
      // If there is at least one business on the list, make the first business the new selected business
      if (businessesToDisplay.length) {
        newSelectedId = businessesToDisplay[0].id

      // If there are no nearby businesses, still display the selected business, if any
      } else {
        if (state.selectedBusinessId && state.businessesToDisplay.length) {
          businessesToDisplay = [ state.businessesToDisplay[0] ]
        }
      }

      state = merge(state, {
        businessListDataSource: state.businessListDataSource.cloneWithRows(businessesToDisplay),
        businessesToDisplay,
        mapViewport: newViewport,
        selectedBusinessId: newSelectedId
      })
      break

    case 'business/EXPAND_BUSINESS_LIST':
      state = merge(state, {
        businessListExpanded: action.expand
      })
      break

    case 'business/SELECTED_BUSINESS':
      businessesToDisplay = getBusinessesToDisplay(state.businessList, state.mapViewport, action.businessId)
      state = merge(state, {
        selectedBusinessId: action.businessId,
        businessListDataSource: state.businessListDataSource.cloneWithRows(businessesToDisplay),
        businessesToDisplay
      })
      break

    case 'business/RESET_BUSINESSES':
      state = merge(state, {
        businessList: [],
        businessListTimestamp: null,
        businessListExpanded: false,
        businessListDataSource: state.businessListDataSource.cloneWithRows([]),
        businessesToDisplay: [ ]
      })
      break
  }
  return state
}

export default reducer
