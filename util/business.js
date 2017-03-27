import _ from 'lodash'
import haversine from 'haversine'

const BUSINESS_LIST_MAX_LENGTH = 50

export const addColorCodes = (list) => {
    const newList = list
    _.each(newList, (component, index, newList) => {
        const compareColorCodes = (distance) =>
            index >= distance && component.colorCode === newList[index - distance].colorCode
        do {
            component.colorCode = Math.floor(Math.random() * 4)
        } while (compareColorCodes(1) || compareColorCodes(2))
    })
    return newList
}

const orderBusinessList = (viewport) => (business) => businessHasAddress(business) ? haversine(viewport, getBusinessLocation(business)) : Number.MAX_VALUE

const isLocationWithinViewport = (location, viewport) => {
    const isCoordinateWithinViewport = (locationCoord, viewportCoord, delta) =>
        Math.abs(locationCoord - viewportCoord) < delta / 2

    return isCoordinateWithinViewport(location.latitude, viewport.latitude, viewport.latitudeDelta)
        &&  isCoordinateWithinViewport(location.longitude, viewport.longitude, viewport.longitudeDelta)
}

export const shouldBeDisplayed = (viewport) => (business) => businessHasAddress(business) && isLocationWithinViewport(getBusinessLocation(business), viewport)

const businessAtLocation = (location) => (business) => {
    let atLocation = false

    if (businessHasAddress(business)) {
        const { latitude, longitude } = getBusinessLocation(business)
        atLocation = (latitude === location.latitude) && (longitude === location.longitude)
    }

    return atLocation
}

export const getClosestBusinesses = (list, viewport) => {
    const visibleBusinesses = _.filter(list, shouldBeDisplayed(viewport))
    if (_.size(visibleBusinesses) > BUSINESS_LIST_MAX_LENGTH) {
      return []
    }
    const closestBusinesses = _.sortBy(
        visibleBusinesses,
        orderBusinessList(viewport)
    )
    return addColorCodes(closestBusinesses)
}

export const offsetOverlappingBusinesses = (businesses) => {
    var index = 0
    _.each(businesses, (business)=> {
        const { addresses } = business.fields
        if (businessHasAddress(business)) {
            var id = _.values(addresses.value)[0].id
            addresses.value[id].location.longitude = parseFloat(addresses.value[id].location.longitude)
            addresses.value[id].location.latitude = parseFloat(addresses.value[id].location.latitude)
            const previousBusinesses = (_.values(businesses)).slice(0, index)
            while (previousBusinesses.find(businessAtLocation(getBusinessLocation(business)))) {
                addresses.value[id].location.longitude -= 0.00002
                addresses.value[id].location.latitude += 0.00001
            }
        }
        index++
        business.colorCode = 0
    })
    return businesses
}

const hasCategory = (category) => (business) => business.fields.businesscategory && business.fields.businesscategory.value.includes(category)

const hasExclusiveCategory = (activeFilters, category) => (business) => business.fields.businesscategory && business.fields.businesscategory.value.includes(category) && _.every(activeFilters, (filter) => !business.fields.businesscategory.value.includes(filter))

export const getBusinessesByFilter = (businesses, category) => {
    return _.filter(businesses, hasCategory(category))
}

export const getBusinessesByExclusiveFilter = (businesses, activeFilters, category) => {
    return _.filter(businesses, hasExclusiveCategory(activeFilters, category))
}

export const isIncorrectLocation = (location) => {
    return _.inRange(location.longitude, -0.01, 0.01) && _.inRange(location.latitude, -0.01, 0.01)
  }

export const businessHasAddress = (business) => business.fields.addresses && _.size(business.fields.addresses.value) > 0 && _.values(business.fields.addresses.value)[0].location

export const getBusinessLocation = (business) => _.values(business.fields.addresses.value)[0].location

export const getBusinessName = (business) => _.size(business.fields.addresses.value) > 0 ? _.values(business.fields.addresses.value)[0].name : ''

export const getBusinessImage = (business) => business.fields.image.value
    ? business.fields.image.field.options.baseUrl + business.fields.image.value.name
    : undefined

export const getBusinessAddress = (business) => _.values(business.fields.addresses.value)[0]

export const getBusinessLatitude = (business) => _.values(business.fields.addresses.value)[0].location.latitude

export const getBusinessLongitude = (business) => _.values(business.fields.addresses.value)[0].location.longitude
