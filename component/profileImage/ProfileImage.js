import React from 'react'
import {Image} from 'react-native'

const ProfileImage = ({img, category, style, alternativeStyle}) => {
  if (img) {
    return <Image style={style} source={{uri: img.url}}/>
  }

  let imgSource = require('./temp_shop.png')

  switch (category) {
    case 'person':
      imgSource = require('./temp_person.png')
      break
    case 'shop':
      imgSource = require('./temp_shop.png')
      break
  }

  return <Image style={alternativeStyle ? alternativeStyle : style} source={imgSource}/>
}

export default ProfileImage
