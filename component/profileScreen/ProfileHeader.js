import React from 'react'
import { View, Image, TouchableHighlight } from 'react-native'
import MapView from 'react-native-maps'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import styles from './ProfileStyle'
import merge from '../../util/merge'
import { renderMarker } from '../searchTab/BackgroundMap'

import  { CloseButton } from '../common/CloseButton'

const CLOSE_BUTTON = require('./../common/assets/Close_Blue.png')

const renderCloseButton = (onPress) =>
  <CloseButton style={styles.header.closeButton} onPress={onPress} closeButtonType={CLOSE_BUTTON} size={70}/>

const getMapRegion = (location) => ({
  latitude: location.latitude + 0.00038,
  longitude: location.longitude,
  latitudeDelta: 0.001,
  longitudeDelta: 0.0003
})

const background = (props) => {
  if (props.address && props.address.location) {
    return <MapView style={styles.header.backgroundImage}
        region={getMapRegion(props.address.location)}
        showsPointsOfInterest={false}
        showsUserLocation={false}
        showsCompass={false}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        onPress={props.goToLocation}>
      {renderMarker({
        key: 'marker',
        address: props.address,
        selected: true
      })}
    </MapView>
  }
  return <Image source={require('./assets/gorillaWithBackground.png')}
      style={styles.header.backgroundImage}
      resizeMode='cover' />
}

const ProfileHeader = (props) => {
  const getBackground = () => {
    return props.paymentComplete ? undefined  : background(props)
  }

  const getSubtitleStyle = () => {
    return props.paymentComplete ? styles.header.subtitle : merge(styles.header.subtitle, {marginBottom: 46})
  }

  return (
    <View>
      { getBackground(props) }
      { props.isModal ? renderCloseButton(props.onPressClose) : undefined }
      <TouchableHighlight onPress={props.goToLocation} underlayColor='transparent'>
        <View style={styles.header.center}>
          <ProfileImage
            image={props.image && {uri: props.image.url}}
            style={styles.header.businessLogo}
            category={props.category}
            colorCode={0} />
          <DefaultText style={styles.header.title}>{props.name}</DefaultText>
          <DefaultText style={getSubtitleStyle()}>{props.username}</DefaultText>
        </View>
      </TouchableHighlight>
    </View>
  )
}

export default ProfileHeader
