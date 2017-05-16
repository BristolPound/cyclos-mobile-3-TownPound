import React from 'react'
import { Marker } from 'react-native-maps'
import platform from '../../util/Platforms'
import { Image, View } from 'react-native'
import DefaultText from '../DefaultText'
import Images from '@Assets/images'

const getClusterDetails = (pointCount, selected) => {
  var image
  var fontSize
  var marginTop
  var marginLeft
  switch (true) {
    case (pointCount > 99):
      image = selected ? Images.selectedClusterOver99 : Images.clusterOver99
      marginTop = 5
      marginLeft = 14.5
      fontSize = 13
      break;
    case (pointCount > 9):
      image = selected ? Images.selectedClusterOver9 : Images.clusterOver9
      marginTop = 3
      marginLeft = 13
      fontSize = 13
      break;
    default:
      image = selected ? Images.selectedCluster : Images.cluster
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

  const marker = selected ? Images.selectedTrader : Images.marker
  return <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}
      image={marker}/>
}

export default MapMarker
