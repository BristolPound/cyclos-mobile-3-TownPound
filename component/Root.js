import React from 'react'
import Tabs from './Tabs'
import { View } from 'react-native'
import ReturningLogin from './login/ReturningLogin'
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
  if (props.returningLogin) {
    return <ReturningLogin/>
  } else {
    return <Tabs/>
  }
}

const mapStateToProps = (state) => ({
    ...state.navigation
})

export default connect(mapStateToProps)(Root)
