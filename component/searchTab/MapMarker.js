import React from 'react'
import { Marker } from 'react-native-maps'
import platform from '../../util/Platforms'
import { Image, View } from 'react-native'
import DefaultText from '../DefaultText'

import markerImage from './assets/marker.png'
import selectedMarkerImage from './assets/selected_trader.png'
import cluster from './assets/cluster.png'
import clusterOver9 from './assets/over_9.png'
import clusterOver99 from './assets/over_99.png'
import selectedCluster from './assets/selected_cluster.png'
import selectedClusterOver9 from './assets/selected_over_9.png'
import selectedClusterOver99 from './assets/selected_over_99.png'

const getClusterDetails = (pointCount, selected) => {
  var image
  var fontSize
  var marginTop
  var marginLeft
  switch (true) {
    case (pointCount > 99):
      image = selected ? selectedClusterOver99 : clusterOver99
      marginTop = 5
      marginLeft = 14.5
      fontSize = 13
      break;
    case (pointCount > 9):
      image = selected ? selectedClusterOver9 : clusterOver9
      marginTop = 3
      marginLeft = 13
      fontSize = 13
      break;
    default:
      image = selected ? selectedCluster : cluster
      marginTop = 7/3
      marginLeft = 12.5
      fontSize = 12
      break;
  }
  return {image, marginTop, marginLeft, fontSize}
}

const MapMarker = ({ coordinate, selected, onPress, pointCount }) => {
  if (pointCount) {
    const {image, marginTop, marginLeft, fontSize} = getClusterDetails(pointCount, selected)
    return <Marker
        coordinate={coordinate}
        onPress={onPress}
        key={coordinate.latitude + '-' + coordinate.longitude}
        anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}
        image={image}>
        <View>
          <DefaultText style={{ color: 'white', fontSize, marginTop, marginLeft }}>
            {pointCount}
          </DefaultText>
        </View>
    </Marker>
  }

  const marker = selected ? selectedMarkerImage : markerImage
  return <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}
      image={marker}/>
}

export default MapMarker
