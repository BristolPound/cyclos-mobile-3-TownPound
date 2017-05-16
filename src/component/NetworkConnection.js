import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import DefaultText from './DefaultText'
import color from '../util/colors'

const style = {
  banner: {
    position: 'absolute',
    bottom: 0,
    height: 40,
    left: 0,
    right: 0,
    backgroundColor: color.gray3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: color.white
  }
}
const NetworkConnection = (props) =>
  !props.status
    ? <View style={style.banner}>
        <DefaultText style={style.text}>Unable to connect to internet</DefaultText>
      </View>
    : null

const mapStateToProps = (state) => ({...state.networkConnection})

export default connect(mapStateToProps)(NetworkConnection)
