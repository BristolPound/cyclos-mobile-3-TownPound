import React from 'react'
import { Marker } from 'react-native-maps'
import platform from '../../util/Platforms'
import { Image } from 'react-native'
import DefaultText from '../DefaultText'

const markerImage = require('./assets/marker.png')
const selectedMarkerImage = require('./assets/selected_trader.png')
const clusterOver4 = require('./assets/cluster.png')
const clusterOver9 = require('./assets/over_9.png')
const clusterOver99 = require('./assets/over_99.png')

const getClusterImage = (pointCount) => {
  return pointCount > 99
    ? clusterOver99
    : ( pointCount > 9
        ? clusterOver9
        : clusterOver4
      )
}

const MapMarker = ({ coordinate, selected, onPress, pointCount }) => {
  if (pointCount) {
    const marginTop = pointCount > 99 ? 4.5 : pointCount > 9 ? 2.5 : 7/3
    const marginLeft = pointCount > 99 ? 14.5 : pointCount > 9 ? 13 : 12.5
    const fontSize = pointCount > 9 ? 13 : 12
    return <Marker
        coordinate={coordinate}
        onPress={onPress}
        anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}>
        <Image
          source={getClusterImage(pointCount)}
          style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <DefaultText style={{ color: 'white', fontSize, marginTop, marginLeft }}>
            {pointCount}
          </DefaultText>
        </Image>
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
