import React from 'react'
import { Marker } from 'react-native-maps'
import platform from '../../util/Platforms'
import { isScreenSmall } from '../../util/ScreenSizes'
import { Image, View, Text } from 'react-native'
import Images from '@Assets/images'
import { Dimensions } from 'react-native'

const getClusterDetails = (pointCount, selected) => {
  var image
  var fontSize
  var marginTop
  var marginLeft
  switch (true) {
    case (pointCount > 99):
      image = selected ? Images.selectedOver99 : Images.clusterOver99
      marginTop = isScreenSmall ? 4 : 3
      marginLeft = 14.5
      break;
    case (pointCount > 9):
      image = selected ? Images.selectedOver9 : Images.clusterOver9
      marginTop = isScreenSmall ? 3 : 2
      marginLeft = 13
      break;
    default:
      image = selected ? Images.selectedCluster : Images.cluster
      marginTop = isScreenSmall ? 2 : 1
      marginLeft = 13.5
      break;
  }
  return {image, marginTop, marginLeft}
}

const MapMarker = ({ coordinate, selected, onPress, pointCount }) => {
  if (pointCount) {
    const {image, marginTop, marginLeft} = getClusterDetails(pointCount, selected)
    // added Date.now into marker key to force update marker (fixes cluster text disappearing)
    return <Marker
        coordinate={coordinate}
        onPress={onPress}
        key={coordinate.latitude + '-' + coordinate.longitude + '-' + Date.now()}
        anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}
        image={image}>
        <View collapsible={false}>
          <Text style={{ color: 'white', marginLeft, marginTop, includeFontPadding: false}}>
            {pointCount}
          </Text>
        </View>
    </Marker>
  }

  const marker = selected ? Images.selectedTrader : Images.marker
  return <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}
      image={marker}/>
}

export default MapMarker
