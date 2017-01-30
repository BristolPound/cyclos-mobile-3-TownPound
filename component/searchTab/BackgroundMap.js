import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Image } from 'react-native'
import _ from 'lodash'
import supercluster from 'supercluster'

import DefaultText, { MultilineText } from '../DefaultText'
import * as actions from '../../store/reducer/business'
import platform from '../../util/Platforms'
import { horizontalAbsolutePosition } from '../../util/StyleUtils'
import { shouldBeDisplayed } from '../../util/business'
import merge from '../../util/merge'

const MAP_PAN_DEBOUNCE_TIME = 600

const markerImage = require('./assets/Marker_alt.png')

const selectedMarkerImage = require('./assets/selected_trader.png')

const clusterImage = require('./assets/Android_marker.png')

const style = {
  mapContainer: {
    ...horizontalAbsolutePosition(0, 0),
    top: -80,
    bottom: -80,
  },
  map: {
    ...horizontalAbsolutePosition(0, 0),
    top: 0,
    bottom: 0,
  },
  loadingOverlay: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white'
  },
  warningContainer: {
    backgroundColor: 'red',
    height: 320,
    ...horizontalAbsolutePosition(0, 0),
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    top: 0
  }
}

export const MapMarker = ({ coordinate, selected, onPress, pointCount }) => {
  if (pointCount) {
    const width = pointCount > 99 ? 34 : 24
    return <MapView.Marker
        coordinate={coordinate}
        anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}>
      <View style={{ alignItems: 'center', width }}>
        <Image source={clusterImage} style={{ position: 'absolute', left: (width - 18) / 2 }}/>
        <DefaultText style={platform.isIOS() ? { bottom: 1 } : {}}>{pointCount}</DefaultText>
      </View>
    </MapView.Marker>
  }

  const marker = selected ? selectedMarkerImage : markerImage
  return <MapView.Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}
      image={marker}/>
}

const renderClusteredMarker = ({ selectBusiness, businessList, selectedBusinessId }) =>
  ({ geometry, properties }) => {
    // we have to separate out the behaviour by platform for Image placing:
    //     https://github.com/airbnb/react-native-maps/blob/master/docs/marker.md
    //       ios - centerOffset: By default, the center point of an annotation view is placed at the coordinate point of the associated annotation.
    //       android - anchor: manually center
    const coordinate = {
      longitude: geometry.coordinates[0],
      latitude: geometry.coordinates[1]
    }

    let onPress = null
    let selected = null
    if (properties.point_count === 1 || !properties.point_count) {
      const business = businessList.find(b =>
        b.address && b.address.location
        && (b.address.location.latitude === coordinate.latitude)
        && (b.address.location.longitude === coordinate.longitude))
      if (business) {
        onPress = () => selectBusiness(business.id)
        selected = business.id === selectedBusinessId
      }
    }

    return <MapMarker key={coordinate.latitude.toString()+coordinate.longitude.toString()}
        selected={selected}
        coordinate={coordinate}
        onPress={onPress}
        pointCount={properties.point_count}/>
  }

const renderBusinessMarker = (business, isSelected, onPress) => {
  return <MapMarker key={business.id}
      coordinate={business.address.location}
      selected={isSelected}
      onPress={onPress} />
}


class BackgroundMap extends React.Component {
  onRegionChangeComplete = () => {}
  onRegionChange = () => {}

  constructor(props) {
    super()
    this.state = ({ loading: true, markerArray: [] })
    this.forceRegion = merge(props.forceRegion)
    this.currentRegion = merge(props.forceRegion)
    this.supercluster = supercluster({})
  }

  componentDidMount() {
    // To prevent the user seeing the centre of the earth when opening the app
    // and to prevent phony region changes
    setTimeout(() => {
      this.onRegionChangeComplete = _.debounce((region) => {
        this.props.updateMapViewport(region)
        this.updateMarkers()
      }, MAP_PAN_DEBOUNCE_TIME)
      this.onRegionChange = (region) => this.currentRegion = merge(region)
      if (this.props.businessList) {
        this.populateSupercluster()
      }
      this.setState({ loading: false })
    }, 1500)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.forceRegion !== this.props.forceRegion) {
      this.forceRegion = merge(nextProps.forceRegion)
      this.currentRegion = merge(nextProps.forceRegion)
      this.updateMarkers()
    } else {
      this.forceRegion = undefined
    }
  }

  componentDidUpdate(lastProps) {
    if (lastProps.businessList !== this.props.businessList) {
      this.populateSupercluster()
    } else if (lastProps.forceRegion !== this.props.forceRegion
        || lastProps.selectedBusinessId !== this.props.selectedBusinessId) {
      this.updateMarkers()
    }
  }

  populateSupercluster() {
    this.supercluster.load(this.props.businessList.filter(b => b.address)
      .map((b) => ({
        geometry: {
          coordinates: [
            b.address.location.longitude,
            b.address.location.latitude
          ]
        },
        properties: {},
        id: b.id
    })))
    this.updateMarkers()
  }

  getZoomLevel(region = this.currentRegion) {
    // http://stackoverflow.com/a/6055653
    const angle = region.longitudeDelta

    // 0.95 for finetuning zoomlevel grouping
    return Math.round(Math.log(360 / angle) / Math.LN2)
  }

  updateMarkers(props = this.props) {
    if (props.businessList) {
      if (this.currentRegion.longitudeDelta > 0.008) {
        const clusteredMarkers = this.supercluster.getClusters([
          this.currentRegion.longitude - this.currentRegion.longitudeDelta * 0.6,
          this.currentRegion.latitude - this.currentRegion.latitudeDelta * 0.6,
          this.currentRegion.longitude + this.currentRegion.longitudeDelta * 0.6,
          this.currentRegion.latitude + this.currentRegion.latitudeDelta * 0.6,
        ], this.getZoomLevel())
        this.setState({ markerArray: clusteredMarkers.map(renderClusteredMarker(props)) })
      } else {
        this.setState({
          markerArray: props.businessList.filter(shouldBeDisplayed(this.currentRegion))
            .map((b) => renderBusinessMarker(b, this.isSelected(b), () => props.selectBusiness(b.id)))
          })
      }
    }
  }

  isSelected(business) {
    return business.id === this.props.selectedBusinessId
  }

  render() {
    return (
      <View style={style.mapContainer}>
        {this.state.loading
          ? undefined
          : <View style={style.warningContainer}>
            <MultilineText style={{textAlign: 'center'}}>
              Google Play Services is out of date. You can get the latest version from the Play Store
            </MultilineText>
          </View>}
        <MapView style={style.map}
            region={this.forceRegion}
            showsPointsOfInterest={false}
            showsUserLocation={true}
            showsCompass={false}
            rotateEnabled={false}
            pitchEnabled={false}
            scrollEnabled={!this.state.loading}
            zoomEnabled={!this.state.loading}
            onRegionChange={(region) => this.onRegionChange(region)}
            onRegionChangeComplete={(region) => this.onRegionChangeComplete(region)}
            loadingEnabled={true}
            moveOnMarkerPress={false}>
          {this.state.markerArray}
        </MapView>
        {this.state.loading
          ? <View style={style.loadingOverlay}/>
          : undefined}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  selectedBusinessId: state.business.selectedBusinessId,
  businessList: state.business.businessList,
  forceRegion: state.business.forceRegion
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
