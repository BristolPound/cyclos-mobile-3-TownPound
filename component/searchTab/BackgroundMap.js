import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Platform, View, Dimensions } from 'react-native'
import _ from 'lodash'
import supercluster from 'supercluster'

import { MultilineText } from '../DefaultText'
import * as actions from '../../store/reducer/business'
import { maxCollapsedHeight, SEARCH_BAR_MARGIN, SEARCH_BAR_HEIGHT } from './SearchTabStyle'
import platform from '../../util/Platforms'
import { dimensions, horizontalAbsolutePosition } from '../../util/StyleUtils'
import { shouldBeDisplayed } from '../../util/business'
import merge from '../../util/merge'

const MAP_PAN_DEBOUNCE_TIME = 300
const BOTTOM_OFFSET = -25

const markerImage = {
  [platform.IOS]: require('./assets/Marker_alt.png'),
  [platform.ANDROID]: require('./assets/Android_marker.png')
}

const selectedMarkerImage = {
  [platform.IOS]: require('./assets/selected_trader.png'),
  [platform.ANDROID]: require('./assets/Android_selected_marker.png')
}

const mapTopOffset = -1 * maxCollapsedHeight + SEARCH_BAR_MARGIN + SEARCH_BAR_HEIGHT + BOTTOM_OFFSET
const mapHeight =  Dimensions.get('window').height - mapTopOffset - BOTTOM_OFFSET
const mapWidth = Dimensions.get('window').width

const style = {
  mapContainer: {
    ...horizontalAbsolutePosition(0, 0),
    top: mapTopOffset,
    height: mapHeight,
  },
  map: {
    ...dimensions(mapWidth, mapHeight),
    position: 'absolute'
  },
  loadingOverlay: {
    ...dimensions(mapWidth, mapHeight),
    backgroundColor: 'white'
  },
  warningContainer: {
    backgroundColor: 'red',
    height: 320,
    ...horizontalAbsolutePosition(0, 0),
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    top: - mapTopOffset
  }
}

export const MapMarker = ({ coordinate, selected, onPress }) => {
  const marker = selected ? selectedMarkerImage : markerImage

  const markerProps = Platform.select({
    android: {
      anchor: {x: 0.5, y: 0.5},  // center image on location.
      image: marker[platform.ANDROID]
    },
    ios: {
      image: marker[platform.IOS]
    }
  })

  // custom image file
  return <MapView.Marker
      coordinate={coordinate}
      onPress={onPress}
      {...markerProps} />
}

const renderClusteredMarker = ({ geometry, properties, id }, index) => {
  // we have to separate out the behaviour by platform for Image placing:
  //     https://github.com/airbnb/react-native-maps/blob/master/docs/marker.md
  //       ios - centerOffset: By default, the center point of an annotation view is placed at the coordinate point of the associated annotation.
  //       android - anchor: manually center
  const coordinate = {
    longitude: geometry.coordinates[0],
    latitude: geometry.coordinates[1]
  }

  const selected = properties.selected

  return <MapMarker key={index} selected={selected} coordinate={coordinate} />
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
    }, platform.isIOS() ? 1500 : 500)
  }

  componentWillReceiveProps(nextProps) {
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
    }
    else if (lastProps.forceRegion !== this.props.forceRegion
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
      if (this.currentRegion.longitudeDelta > 0.01) {
        const clusteredMarkers = this.supercluster.getClusters([
          this.currentRegion.longitude - this.currentRegion.longitudeDelta,
          this.currentRegion.latitude - this.currentRegion.latitudeDelta,
          this.currentRegion.longitude + this.currentRegion.longitudeDelta,
          this.currentRegion.latitude + this.currentRegion.latitudeDelta,
        ], this.getZoomLevel())
        this.setState({ markerArray: clusteredMarkers.map(renderClusteredMarker) })
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
  forceRegion: state.business.forceRegion,
  mapViewport: state.business.mapViewport
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
