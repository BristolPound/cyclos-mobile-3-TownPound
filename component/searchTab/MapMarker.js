import React from 'react'
import { Marker } from 'react-native-maps'
import platform from '../../util/Platforms'
import { View, Image } from 'react-native'
import DefaultText from '../DefaultText'

const markerImage = require('./assets/Marker_alt.png')
const selectedMarkerImage = require('./assets/selected_trader.png')
const clusterImage18 = require('./assets/Cluster_18.png')
const clusterImage22 = require('./assets/Cluster_22.png')
const clusterImage26 = require('./assets/Cluster_26.png')

const MapMarker = ({ coordinate, selected, onPress, pointCount }) => {
  if (pointCount) {
    const width = pointCount > 99 ? 34 : 24
    let clusterImage = clusterImage18
    let bottom = 0
    let imageleftOffset = (width - 18) / 2
    if (pointCount > 9) {
      clusterImage = clusterImage22
      imageleftOffset = (width - 22) / 2
      bottom = -2
    }
    if (pointCount > 99) {
      clusterImage = clusterImage26
      imageleftOffset = (width - 26) / 2
      bottom = -4
    }
    return <Marker
        coordinate={coordinate}
        onPress={onPress}
        anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}>
      <View style={{ alignItems: 'center', width }}>
        <Image source={clusterImage} style={{ position: 'absolute', left: imageleftOffset }}/>
        <DefaultText style={{ bottom, color: 'white', fontSize: 14 }}>{pointCount}</DefaultText>
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
