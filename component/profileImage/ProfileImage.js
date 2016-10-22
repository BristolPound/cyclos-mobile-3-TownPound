import React from 'react'
import { Image } from 'react-native'
import _ from 'lodash'

const ProfileImage = ({img, category, style}) => {
  if (img) {
    return <Image style={style} source={{uri: img.url}}/>
  }

  // if an image is not supplied, use a category image
  let imgSource = require('./temp_shop.png')
  switch (category) {
    case 'person':
      imgSource = require('./temp_person.png')
      break
    case 'shop':
      imgSource = require('./temp_shop.png')
      break
  }

  // remove any borders from the style
  const borderlessStyle = _.pickBy(style, (_, key) => !key.startsWith('border'))

  return <Image style={borderlessStyle} source={imgSource}/>
}

export default ProfileImage
