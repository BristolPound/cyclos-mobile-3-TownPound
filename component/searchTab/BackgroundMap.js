import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Platform, StyleSheet } from 'react-native'
import _ from 'lodash'
import * as actions from '../../store/reducer/business'

const MAP_PAN_DEBOUNCE_DURATION = 150

const UNSELECTED_TRADER_IMG = require('./Marker.png')
const SELECTED_TRADER_IMG = require('./selected_trader.png')

class BackgroundMap extends React.Component {
  constructor() {
    super()
    this.ignoreLocationUpdates = false
  }

  updateViewport(...args) {
    this.ignoreLocationUpdates = true
    this.props.updateMapViewport(...args)
  }

  isSelected(business) {
    return this.props.selectedBusinessId === business.id
  }

  renderMarker(business) {
    // we have to separate out the behaviour by platform for:
    // * behaviour - https://github.com/airbnb/react-native-maps#custom-callouts
    //     android moves viewspace when the marker is selected, ios shouldn't.
    // * Image placing:
    //     https://github.com/airbnb/react-native-maps/blob/master/docs/marker.md
    //       ios - centerOffset: By default, the center point of an annotation view is placed at the coordinate point of the associated annotation.
    //       android - anchor: manually center

      const markerProps = Platform.select({
        android: {
          onPress: () => {
            this.props.updateMapViewportAndSelectClosestTrader(business.address.location)
          },
          anchor: {x: 0.5, y: 0.5},  // center image on location.
        },
        ios: {
          onPress: () => this.props.selectBusiness(business.id)
        }
      })

      // custom image file
      return <MapView.Marker
          key={business.id}
          coordinate={business.address.location}
          {...markerProps}
          image={this.isSelected(business) ? SELECTED_TRADER_IMG : UNSELECTED_TRADER_IMG}
      />
  }

  render() {
    // Prevent the map from 'jumping back' to the last processed location
    const region = this.ignoreLocationUpdates ? undefined : this.props.mapViewport

    let markerArray = undefined
    if (this.props.businessList) {
      markerArray = this.props.businessList.filter(b => b.address)
        .map(this.renderMarker.bind(this))
    }

    return (
      <MapView style={{...StyleSheet.absoluteFillObject}}
          region={region}
          showsPointsOfInterest={false}
          showsUserLocation={true}
          showsCompass={false}
          rotateEnabled={false}
          pitchEnabled={false}
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
