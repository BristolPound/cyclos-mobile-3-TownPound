import React from 'react'
import MapView from 'react-native-maps'
import _ from 'lodash'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'

// throttle map location updates to a maximum of 5 per second
const DEBOUNCE_DURATION = 200

import { updateMapViewport } from '../store/reducer/map'

const BackgroundMap = (props) =>
  <MapView style={{...StyleSheet.absoluteFillObject}}
        region={props.mapPosition}
        onRegionChange={_.debounce(props.updateMapViewport, DEBOUNCE_DURATION)}>
      {props.business.filter(b => b.address)
        .map(b =>
            <MapView.Marker key={b.shortDisplay}
                coordinate={b.address.location}
                onPress={() => props.updateMapViewport({
                  latitude: b.address.location.latitude,
                  longitude: b.address.location.longitude,
                  latitudeDelta: props.mapPosition.latitudeDelta,
                  longitudeDelta: props.mapPosition.longitudeDelta
                })}
                pinColor={b.id !== props.selected ? 'red' : 'blue'}/>
              )
      }
    </MapView>

const mapStateToProps = (state) => ({
  ...state.business,
  mapPosition: state.map
})

const mapDispatchToProps = (dispatch) => ({
  updateMapViewport: (params) => dispatch(updateMapViewport(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
