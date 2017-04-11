import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View } from 'react-native'
import _ from 'lodash'
import supercluster from 'supercluster'
import { MultilineText } from '../DefaultText'
import * as actions from '../../store/reducer/business'
import { shouldBeDisplayed, isIncorrectLocation } from '../../util/business'
import merge from '../../util/merge'
import style from './BackgroundMapStyle'
import MapMarker from './MapMarker'

const MAP_PAN_DEBOUNCE_TIME = 600

class BackgroundMap extends React.Component {
  onRegionChangeComplete = () => {}
  onRegionChange = () => {}

  constructor(props) {
    super()
    this.state = ({ loading: true, markerArray: [] })
    this.forceRegion = merge(props.forceRegion)
    this.currentRegion = merge(props.forceRegion)
    this.supercluster = supercluster({ radius: 60 })
    this.mapRef = null
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
    this.supercluster.load(_.filter(this.props.businessList, b => b.address.location)
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
    const clusteredMarkers = this.supercluster.getClusters([
      this.currentRegion.longitude - this.currentRegion.longitudeDelta * 0.5,
      this.currentRegion.latitude - this.currentRegion.latitudeDelta * 0.5,
      this.currentRegion.longitude + this.currentRegion.longitudeDelta * 0.5,
      this.currentRegion.latitude + this.currentRegion.latitudeDelta * 0.5,
    ], this.getZoomLevel())
    this.setState({ markerArray: clusteredMarkers.map(this.renderClusteredMarker(props)) })
  }

  isSelected(business) {
    return business.id === this.props.selectedBusinessId
  }

  zoomToCluster = (coordinate) => {
    const region = {
      longitude: coordinate.longitude,
      latitude: coordinate.latitude,
      longitudeDelta: this.currentRegion.longitudeDelta * 0.5,
      latitudeDelta: this.currentRegion.latitudeDelta * 0.5
    }
    this.mapRef.animateToRegion(region, 300)
  }

  renderClusteredMarker = ({ selectBusiness, selectedBusinessId }) =>
    ({ geometry, properties, id }) => {
      const coordinate = {
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1]
      }

      let onPress = null
      let selected = null
      if ( id && (properties.point_count === 1 || !properties.point_count) ) {
          onPress = () => selectBusiness(id)
          selected = id === selectedBusinessId
      } else if (properties.point_count > 1 ) {
        onPress = () => this.zoomToCluster(coordinate)
      }

      return isIncorrectLocation(coordinate)
              ? undefined
              : <MapMarker key={coordinate.latitude.toString()+coordinate.longitude.toString()}
                  selected={selected}
                  coordinate={coordinate}
                  onPress={onPress}
                  pointCount={properties.point_count}/>
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
            region={this.forceRegion || this.currentRegion}
            ref={(ref) => { this.mapRef = ref }}
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
  businessList: state.business.filteredBusinesses.length > 0 ? state.business.filteredBusinesses : state.business.businessList,
  forceRegion: state.business.forceRegion
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
