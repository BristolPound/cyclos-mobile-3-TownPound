import React from 'react'
import { Marker } from 'react-native-maps'
import platform from '../../util/Platforms'
import { isScreenSmall } from '../../util/ScreenSizes'
import { Image, View, Text } from 'react-native'
import Images from '@Assets/images'
import Colors from '@Colors/colors'
import { Dimensions } from 'react-native'

const getClusterDetails = (pointCount, selected) => {
  var image
  var fontSize
  var marginTop
  var marginLeft
  switch (true) {
    case (pointCount > 99):
      image = selected ? Images.cluster.selected_000 : Images.cluster.normal_000
      marginTop = isScreenSmall ? 4 : 3
      marginLeft = 14.5
      break;
    case (pointCount > 9):
      image = selected ? Images.cluster.selected_00 : Images.cluster.normal_00
      marginTop = isScreenSmall ? 3 : 2
      marginLeft = 13
      break;
    default:
      image = selected ? Images.cluster.selected_0 : Images.cluster.normal_0
      marginTop = isScreenSmall ? 2 : 1
      marginLeft = 13.5
      break;
  }
  return {image, marginTop, marginLeft}
}

const MapMarker = ({ coordinate, selected, onPress, pointCount }) => {
  if (pointCount) {
    //const {image, marginTop, marginLeft} = getClusterDetails(pointCount, selected)
    // added Date.now into marker key to force update marker (fixes cluster text disappearing)
    const tintColor = selected ? Colors.primaryBlue : Colors.secondaryBlue;
    return <Marker
        coordinate={coordinate}
        onPress={onPress}
        key={coordinate.latitude + '-' + coordinate.longitude + '-' + Date.now()}
        anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}
        >
        <Image
         style={{
            tintColor: tintColor,
          }}
          source={Images.cluster.circle}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            {pointCount}
          </Text>
        </View>
    </Marker>
  }

  const marker = selected ? Images.marker.selected : Images.marker.account
  return <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={platform.isIOS() ? null : { x: 0.5, y: 0.5 }}
      image={marker}/>
}

export default MapMarker
