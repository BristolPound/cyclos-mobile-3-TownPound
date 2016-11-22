import React from 'react'
import Tabs from './Tabs'
import { View } from 'react-native'
import ReturningLogin from './login/ReturningLogin'
import Onboarding from './login/Onboarding'
import { mainComponent } from '../store/reducer/navigation'
import { connect } from 'react-redux'

const Root = (props) => {
  // The app is rendered before the state has been loaded via redux-persist. This state property allows
  // the main 'app' UI to be hidden until initialised.
  if (!props.stateInitialised) {
    return (
      // TODO: style as part of the splash screen
      <View style={{flex: 1}}/>
    )
  }
  if (props.mainComponent === mainComponent.returningLogin) {
    return <ReturningLogin />
  } else if (props.mainComponent === mainComponent.onboarding) {
    return <Onboarding />
  } else if (props.mainComponent === mainComponent.tabs){
    return <Tabs />
  } else {
    throw new Error('Invalid navigation state')
  }
}

const mapStateToProps = (state) => ({
    ...state.navigation
})

export default connect(mapStateToProps)(Root)
