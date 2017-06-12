import React from 'react'
import { View, Image } from 'react-native'
import { isScreenSmall } from '../../util/ScreenSizes'
import Colors from '@Colors/colors'
import Images from '@Assets/images'
import merge from '../../util/merge'

const logo = isScreenSmall ? Images.onboardingLogoSE : Images.onboardingLogo7
const background = Images.background

const style = {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    top: 0, 
    flex: 1,
    alignItems: 'center'
}

const AppCover = (props) => 
    <View style={merge(style, props.unlockOpened ? { padding: 45 } : { justifyContent: 'center'})}>
        <Image source={background} style={style} />
        <Image source={logo} />
    </View>


export default AppCover
