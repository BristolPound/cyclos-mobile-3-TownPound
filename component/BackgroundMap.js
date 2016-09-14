import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'

import { updateMap } from '../store/reducer/map'


// This slightly strange structure (taking the first element out of the array)
// is to avoid pins getting 'stuck' on blue (yes this really happens!)

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
        onRegionChange={props.updateMap}>
      {renderClosestMarker(props.business, props.selected)}
      {props.business.filter(b => b.address)
        .map(b =>
          b.id !== props.selected ?
            <MapView.Marker key={b.shortDisplay}
                coordinate={b.address.location}
            /> : undefined
      )}
    </MapView>

const mapStateToProps = (state) => ({
  ...state.business,
  mapPosition: state.map
})

const mapDispatchToProps = (dispatch) => ({
  updateMap: (params) => dispatch(updateMap(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
