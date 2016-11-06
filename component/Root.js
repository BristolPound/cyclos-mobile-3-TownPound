import React from 'react'
import Tabs from './Tabs'
import { View } from 'react-native'
import ReturningLogin from './ReturningLogin'
import { connect } from 'react-redux'

const Root = (props) => {
  if (!props.stateInitialised) {
    return (
      // TODO: style as part of the login screen
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
