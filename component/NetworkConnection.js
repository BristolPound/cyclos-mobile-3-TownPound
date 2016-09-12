import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import color from '../util/colors'

const style = {
  banner: {
    position: 'absolute',
    top:0,
    height: 60,
    left: 0,
    right: 0,
    backgroundColor: color.lightGray,
    paddingTop: 30,
    paddingLeft: 10
  }
}
const NetworkConnection = (props) => {
    if (!props.status) {
      return (
        <View style={style.banner}>
          <Text>Network connection issues, some features won't work</Text>
        </View>
      )
    }
    return null
  }

const mapStateToProps = (state) => ({...state.networkConnection})

export default connect(mapStateToProps)(NetworkConnection)
