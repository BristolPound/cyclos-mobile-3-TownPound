import React from 'react'
import { View, TouchableHighlight, Image } from 'react-native'
import DefaultText from './DefaultText'

const style = {
  title: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 25
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
  <View style={{ height: 500 }}>
    <TouchableHighlight onPress={() => props.navigator.pop()}
        underlayColor='transparent'>
      { props.business.image ? <Image style={style.image} source={{uri: props.business.image.url}}/> : <View style={style.image}/> }
    </TouchableHighlight>
    <DefaultText style={style.title}>{props.business.name}</DefaultText>
  </View>

export default BusinessDetails
