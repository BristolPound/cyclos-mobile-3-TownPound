import React from 'react'
import { View, TouchableHighlight, MapView, Image } from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import DefaultText from './DefaultText'

const parallaxHeight = 200

const style = {
  title: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 25
  },
  fullSize: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0
  },
  image: {
    height: 150,
    width: 150,
    marginTop: -40,
    borderRadius: 20,
    alignSelf: 'center'
  }
}

const BusinessDetails = props =>
  <ParallaxScrollView
      backgroundColor='white'
      contentBackgroundColor='#eee'
      parallaxHeaderHeight={parallaxHeight}
      renderBackground={() => (
        <View style={{height: parallaxHeight}}>
          { props.business.location
            ? <MapView
                style={style.fullSize}
                showsUserLocation={true}
                region={{
                  latitude: props.business.location.latitude,
                  longitude: props.business.location.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005
                }}
                annotations={[{
                  longitude: props.business.location.longitude,
                  latitude: props.business.location.latitude
                }]}>
              </MapView>
            : <View></View>
          }
        </View>
      )}>
      <View style={{ height: 500 }}>
        <TouchableHighlight onPress={() => props.navigator.pop()}
            underlayColor='transparent'>
          <Image style={style.image} source={{uri: props.business.image.url}}/>
        </TouchableHighlight>
        <DefaultText style={style.title}>{props.business.name}</DefaultText>
      </View>
    </ParallaxScrollView>

export default BusinessDetails
