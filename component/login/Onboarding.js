import React from 'react'
import { View, Image } from 'react-native'
import DefaultText, { HyperlinkText } from '../DefaultText'
import Splash from './Splash'
import ScreenSizes from '../../util/ScreenSizes'
import colors from '../../util/colors'
import commonStyle from '../style'

const style = {
  infoText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: commonStyle.museo700
  },
}


const logo = ScreenSizes.isSmall() ? require('./onboarding_logo_SE.png') : require('./onboarding_logo_7.png')

const renderWelcomeMessage = () => <Image source={logo} />
const renderInfoText = () =>
  <View style={{flex: 1, alignItems: 'center'}}>
    <DefaultText style={style.infoText}>If you haven't signed up for Bristol Pound,</DefaultText>
    <View style={{flexDirection: 'row'}}>
      <DefaultText style={style.infoText}>you can do so </DefaultText>
      <HyperlinkText text='from our website' style={style.infoText} link={'http://bristolpound.org'} />
    </View>
  </View>

class Onboarding extends React.Component {
  render() {
    return (
      <Splash loginButtonText='Log in'
        logoutButtonText='I just want to look around'
        renderWelcomeMessage={renderWelcomeMessage}
        renderInfoText={renderInfoText} />
    )
  }
}
export default Onboarding
