import React from 'react'
import DefaultText from '../DefaultText'
import Splash from './Splash'

const renderWelcomeMessage = () => <DefaultText>Bristol Pound</DefaultText>
const renderInfoText = () => <DefaultText>Info</DefaultText>

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
