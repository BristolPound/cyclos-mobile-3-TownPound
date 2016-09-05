import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
const BackgroundMap = (props) => (
  <MapView style={{...StyleSheet.absoluteFillObject}}
      region={{
        latitude: 51.46981,
        longitude: -2.595035,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}>
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
  ...state.business
})

export default connect(mapStateToProps)(BackgroundMap)
