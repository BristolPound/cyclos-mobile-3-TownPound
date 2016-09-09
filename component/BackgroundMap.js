import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'

import { updateMap } from '../store/reducer/map'

const BackgroundMap = (props) => (
  <MapView style={{...StyleSheet.absoluteFillObject}}
      region={props.mapPosition}
      onRegionChange={props.updateMap}>
    {props.business.filter(b => b.address)
      .map(b =>
          <MapView.Marker key={b.shortDisplay}
              coordinate={b.address.location}
              pinColor={b.id === props.selected ? 'blue' : undefined}
              />
    )}
  </MapView>
)

const mapStateToProps = (state) => ({
  ...state.business,
  mapPosition: state.map
})

const mapDispatchToProps = (dispatch) => ({
  updateMap: (params) => dispatch(updateMap(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
