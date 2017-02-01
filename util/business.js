import _ from 'lodash'
import merge from './merge'
import haversine from 'haversine'

const BUSINESS_LIST_MAX_LENGTH = 50

export const addColorCodes = (list) => {
    const newList = list.map(b => merge(b))
    newList.forEach((component, index, newList) => {
        const compareColorCodes = (distance) =>
            index >= distance && component.colorCode === newList[index - distance].colorCode
        do {
            component.colorCode = Math.floor(Math.random() * 4)
        } while (compareColorCodes(1) || compareColorCodes(2))
    })
    return newList
}

const orderBusinessList = (viewport) => (business) => business.address ? haversine(viewport, business.address.location) : Number.MAX_VALUE

const isLocationWithinViewport = (location, viewport) => {
    const isCoordinateWithinViewport = (locationCoord, viewportCoord, delta) =>
        Math.abs(locationCoord - viewportCoord) < delta / 2

    return isCoordinateWithinViewport(location.latitude, viewport.latitude, viewport.latitudeDelta)
        &&  isCoordinateWithinViewport(location.longitude, viewport.longitude, viewport.longitudeDelta)
}

export const shouldBeDisplayed = (viewport) => (business) =>
    business.address && isLocationWithinViewport(business.address.location, viewport)

const businessAtLocation = (location) => (business) => {
    const { address } = business
    let atLocation = false

    if (address && address.location) {
        const { latitude, longitude } = address.location
        atLocation = (latitude === location.latitude) && (longitude === location.longitude)
    }

    return atLocation
}

export const getClosestBusinesses = (list, viewport) => {
    const visibleBusinesses = list.filter(shouldBeDisplayed(viewport))
    if (visibleBusinesses.length > BUSINESS_LIST_MAX_LENGTH) {
      return []
    }
    const closestBusinesses = _.sortBy(
        visibleBusinesses,
        orderBusinessList(viewport)
    )
    return addColorCodes(closestBusinesses)
}

export const offsetOverlappingBusinesses = (businesses) => {
    businesses.forEach((business, index)=> {
        const { address } = business
        if (address && address.location) {
            const previousBusinesses = businesses.slice(0, index)
            while (previousBusinesses.find(businessAtLocation(address.location))) {
                address.location.longitude -= 0.00004
                address.location.latitude += 0.00002
            }
        }
    })
    return businesses
}
