import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Platform, View, Dimensions } from 'react-native'
import _ from 'lodash'
import { MultilineText } from '../DefaultText'
import * as actions from '../../store/reducer/business'
import { maxCollapsedHeight, SEARCH_BAR_MARGIN, SEARCH_BAR_HEIGHT } from './SearchTabStyle'
import platform from '../../util/Platforms'
import { dimensions, horizontalAbsolutePosition } from '../../util/StyleUtils'

const MAP_PAN_DEBOUNCE_DURATION = 150
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

class BackgroundMap extends React.Component {
  regionChanged = () => {}
  constructor(props) {
    super()
    this.state = ({ loading: true })
    this.region = props.forceRegion
  }

  componentDidMount() {
    // To prevent the user seeing the centre of the earth when opening the app
    // and to prevent phony region changes
    setTimeout(() => {
      this.regionChanged = _.debounce(this.props.updateMapViewport, MAP_PAN_DEBOUNCE_DURATION)
      this.setState({loading: false})
    }, platform.isIOS() ? 1500 : 500)
  }

  isSelected(business) {
    return this.props.selectedBusinessId === business.id
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forceRegion !== this.props.forceRegion) {
      this.region = nextProps.forceRegion
    } else {
      this.region = undefined
    }
  }

  renderMarker(business) {
    // we have to separate out the behaviour by platform for:
    // * behaviour - https://github.com/airbnb/react-native-maps#custom-callouts
    //     android moves viewspace when the marker is selected, ios shouldn't.
    // * Image placing:
    //     https://github.com/airbnb/react-native-maps/blob/master/docs/marker.md
    //       ios - centerOffset: By default, the center point of an annotation view is placed at the coordinate point of the associated annotation.
    //       android - anchor: manually center

      const marker = this.isSelected(business) ? selectedMarkerImage : markerImage

      const markerProps = Platform.select({
        android: {
          onPress: () => {
            this.props.updateMapViewportAndSelectClosestTrader(business.address.location)
          },
          anchor: {x: 0.5, y: 0.5},  // center image on location.
          image: marker[platform.ANDROID]
        },
        ios: {
          onPress: () => this.props.selectBusiness(business.id),
          image: marker[platform.IOS]
        }
      })

      // custom image file
      return <MapView.Marker
          key={business.id}
          coordinate={business.address.location}
          {...markerProps} />
  }

  render() {
    let markerArray = undefined
    if (this.props.businessList) {
      markerArray = this.props.businessList.filter(b => b.address)
        .map(this.renderMarker.bind(this))
    }

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
            region={this.region}
            showsPointsOfInterest={false}
            showsUserLocation={true}
            showsCompass={false}
            rotateEnabled={false}
            pitchEnabled={false}
            scrollEnabled={!this.state.loading}
            zoomEnabled={!this.state.loading}
            onRegionChange={this.regionChanged}
            loadingEnabled={true}>
          {markerArray}
        </MapView>
        {this.state.loading
          ? <View style={style.loadingOverlay}/>
          : undefined}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.business,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
