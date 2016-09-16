import React from 'react'
import MapView from 'react-native-maps'
import _ from 'lodash'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'

import { updateMapViewport } from '../store/reducer/map'

const renderClosestMarker = (business, selected) => {
  if (!selected) {
    return undefined
  }
  const selectedBusinessAddress = business.find(b => b.id === selected).address
  if (!selectedBusinessAddress) {
    return undefined
  }
  return <MapView.Marker coordinate={selectedBusinessAddress.location} pinColor={'blue'}/>
}

const BackgroundMap = (props) =>
  <MapView style={{...StyleSheet.absoluteFillObject}}
        region={props.mapPosition}
        onRegionChange={_.debounce(props.updateMapViewport, 200)}>
      {renderClosestMarker(props.business, props.selected)}
      {props.business.filter(b => b.address)
        .map(b =>
          b.id !== props.selected ?
            <MapView.Marker key={b.shortDisplay}
                coordinate={b.address.location}
                onPress={() => props.updateMapViewport({
                  latitude: b.address.location.latitude,
                  longitude: b.address.location.longitude,
                  latitudeDelta: props.mapPosition.latitudeDelta,
                  longitudeDelta: props.mapPosition.longitudeDelta
                })}
            /> : undefined
      )}
    </MapView>

const mapStateToProps = (state) => ({
  ...state.business,
  mapPosition: state.map
})

const mapDispatchToProps = (dispatch) => ({
  updateMapViewport: (params) => dispatch(updateMapViewport(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
