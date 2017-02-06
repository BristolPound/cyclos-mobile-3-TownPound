import React from 'react'
import { Marker } from 'react-native-maps'
import platform from '../../util/Platforms'
import { View, Image } from 'react-native'
import DefaultText from '../DefaultText'

const markerImage = require('./assets/Marker_alt.png')
const selectedMarkerImage = require('./assets/selected_trader.png')
const clusterOver4 = require('./assets/over4.png')
const clusterOver9 = require('./assets/over9.png')
const clusterOver99 = require('./assets/over99.png')

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
    const marginTop = pointCount > 99 ? 4 : 1
    const marginRight = pointCount < 10 ? 2 : 1
    return <Marker
        coordinate={coordinate}
        onPress={onPress}
        anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}>
        <Image 
          source={getClusterImage(pointCount)}
          style={{ alignItems: 'flex-end', justifyContent: 'flex-start' }}>
          <DefaultText style={{ color: 'white', fontSize: 14, marginRight, marginTop }}>
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
