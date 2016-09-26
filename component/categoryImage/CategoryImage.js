import React from 'react'
import {Image} from 'react-native'

const CategoryImage = ({category, style}) => {
  let imgSource = require('./temp_shop.png')

  switch (category) {
    case 'person':
      imgSource = require('./temp_person.png')
      break
    case 'shop':
      imgSource = require('./temp_shop.png')
      break
  }

  return <Image style={style} source={imgSource}/>
}

export default CategoryImage
