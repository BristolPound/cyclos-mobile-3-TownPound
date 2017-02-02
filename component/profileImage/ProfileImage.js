import React from 'react'
import { Image, View } from 'react-native'

const layer = (src, style) => {
  if (src) {
    return <Image style={{flex: 1, position: 'absolute', ...style}} source={src} resizeMode='cover'/>
  }
}

const backgroundImage = [
  require('./assets/BrandBlue1.png'),
  require('./assets/BrandBlue2.png'),
  require('./assets/DarkBlue1.png'),
  require('./assets/SecondaryBlue1.png')
]

const border = {
  offWhite: require('./assets/BorderOffWhite.png'),
}

const categoryImage = {
  shop: require('./assets/shop.png'),
  person: require('./assets/person.png'),
}

const CustomImage = ({image, style, borderColor}) => {
  return (
    <View style={style}>
      {layer(image, {height: style.height - 2, width: style.width - 2, margin: 1})}
      {layer(border[borderColor], {height: style.height, width: style.width})}
    </View>
  )
}

const Placeholder = ({style, colorCode, category}) =>
  <View style={style}>
    {layer(backgroundImage[colorCode], {height: style.height - 2, width: style.width - 2, margin: 1})}
    {layer(categoryImage[category], {height: style.height - 2, width: style.width - 2, margin: 1})}
  </View>

const ProfileImage = (props) =>
    props.image ? <CustomImage {...props}/> : <Placeholder {...props}/>
export default ProfileImage
