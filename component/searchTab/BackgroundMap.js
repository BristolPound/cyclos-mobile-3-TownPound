import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Platform } from 'react-native'
import _ from 'lodash'
import * as actions from '../../store/reducer/business'
import colors from '../../util/colors'
import PLATFORM from '../../stringConstants/platform'

const MAP_PAN_DEBOUNCE_DURATION = 50

class BackgroundMap extends React.Component {
  constructor() {
    super()
    this.skipNextLocationUpdate = false
  }

  updateViewport(...args) {
    this.skipNextLocationUpdate = true
    this.props.updateMapViewport(...args)
  }

  render() {
    // on Android devices, if you update the region to the current location while panning
    // the UI becomes 'jumpy'. For this reason, this 'hack' is used to ensure that
    // location updates arising from dragging the map are suppressed.
    const region = this.skipNextLocationUpdate ? undefined : this.props.mapViewport
    this.skipNextLocationUpdate = false

    let markerArray = undefined
    if (this.props.businessList) {
      markerArray = this.props.businessList.filter(b => b.address)
        .map(b => {
          const markerProps = {
            [Platform.OS === PLATFORM.IOS ? 'onSelect' : 'onPress']: () => {//https://github.com/airbnb/react-native-maps/issues/286
              this.props.selectMarker(b.id)
              this.updateViewport(b.address.location)
            }
          }
          return <MapView.Marker
            key={b.id}
            coordinate={b.address.location}
            {...markerProps}
            image={require('./grey_dot.png')}
            pinColor={this.props.selectedMarker === b.id ? colors.bristolBlue : colors.gray}
            />
        })
    }

    return (
      <MapView style={{...StyleSheet.absoluteFillObject}}
          region={region}
          showsUserLocation={true}
          onRegionChange={_.debounce(this.updateViewport.bind(this), MAP_PAN_DEBOUNCE_DURATION)}>
        {markerArray}
      </MapView>
    )
  }
}


const mapStateToProps = (state) => ({
  ...state.business
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
