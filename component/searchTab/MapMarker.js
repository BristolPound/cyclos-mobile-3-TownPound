import React from 'react'
import { Marker } from 'react-native-maps'
import platform from '../../util/Platforms'
import { View, Image } from 'react-native'
import DefaultText from '../DefaultText'

const markerImage = require('./assets/Marker_alt.png')
const selectedMarkerImage = require('./assets/selected_trader.png')
const clusterImage = require('./assets/Android_marker.png')

const MapMarker = ({ coordinate, selected, onPress, pointCount }) => {
  if (pointCount) {
    const width = pointCount > 99 ? 34 : 24
    return <Marker
        coordinate={coordinate}
        onPress={onPress}
        anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}>
      <View style={{ alignItems: 'center', width }}>
        <Image source={clusterImage} style={{ position: 'absolute', left: (width - 18) / 2 }}/>
        <DefaultText style={platform.isIOS() ? { bottom: 1 } : {}}>{pointCount}</DefaultText>
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
