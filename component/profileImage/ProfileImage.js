import React from 'react'
import { Image, View } from 'react-native'

const layer = (src, style) => {
  if (src) {
    return <Image style={{flex: 1, position: 'absolute', ...style}} source={src} resizeMode='stretch'/>
  }
}

const backgroundImage = [
  require('./BrandBlue1.png'),
  require('./BrandBlue2.png'),
  require('./DarkBlue.png'),
  require('./SecondaryBlue1.png'),
]

const border = {
  offWhite: require('./BorderOffWhite.png'),
}

const categoryImage = {
  shop: require('./shop.png'),
  person: require('./person.png'),
}

const ProfileImage = ({image, style, colorCode, borderColor, category}) =>
  <View style={style}>
    <View style = {{position: 'absolute', margin: 1}}>
      {layer(backgroundImage[colorCode], {height: style.height - 2, width: style.width - 2})}
      {layer(image ? image : categoryImage[category], {height: style.height - 2, width: style.width - 2})}
    </View>
    {image
    ? <View style={{height: style.height, width: style.width, position: 'absolute'}}>
        {layer(border[borderColor], {height: style.height, width: style.width})}
      </View>
    : undefined}
  </View>

export default ProfileImage
