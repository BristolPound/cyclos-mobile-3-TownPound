import React from 'react'
import { View, Image } from 'react-native'
import { isScreenSmall } from '../util/ScreenSizes'
import Colors from '@Colors/colors'
import Images from '@Assets/images'

const logo = isScreenSmall ? Images.onboardingLogoSE : Images.onboardingLogo7

const style = {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    top: 0, 
    backgroundColor: Colors.primaryBlue,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
}

const AppCover = () => 
    <View style={style}>
        <Image source={logo} />
    </View>


export default AppCover
