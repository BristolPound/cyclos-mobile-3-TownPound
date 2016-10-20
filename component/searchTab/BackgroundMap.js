import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet } from 'react-native'
import _ from 'lodash'
import * as actions from '../../store/reducer/business'
import Platforms from '../../util/Platforms'

const MAP_PAN_DEBOUNCE_DURATION = 50

const UNSELECTED_TRADER_IMG = require('./grey_dot.png')
const SELECTED_TRADER_IMG = require('./selected_trader.png')

//https://github.com/airbnb/react-native-maps/issues/286
const onPressPropertyName = Platforms.isIOS() ? 'onSelect' : 'onPress'

class BackgroundMap extends React.Component {
  constructor() {
    super()
    this.skipNextLocationUpdate = false
  }

  updateViewport(...args) {
    this.skipNextLocationUpdate = true
    this.props.updateMapViewport(...args)
  }

  isSelected(business) {
    return this.props.selectedMarker === business.id
  }

  // TODO: On Android tapping on the icon once centers the map, then a second tap toggles the appearance.
  // A tap should not centre the map.
  renderMarker(b) {
      const markerProps = {
        [onPressPropertyName]: () => {//https://github.com/airbnb/react-native-maps/issues/286
          this.props.selectMarker(b.id)
          this.updateViewport(b.address.location)
        }
      }

      // custom image file
      return <MapView.Marker
          key={b.id}
          coordinate={b.address.location}
          {...markerProps}
          image={this.isSelected(b) ? SELECTED_TRADER_IMG : UNSELECTED_TRADER_IMG}
      />
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
        .map(this.renderMarker.bind(this))
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
  ...state.business,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
