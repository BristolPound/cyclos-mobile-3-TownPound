import React from 'react'
import { View, Image, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import DefaultText from './DefaultText'

const style = {
  title: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 25
  },
  image: {
    height: 150,
    width: 150,
    marginTop: -40,
    borderRadius: 20,
    alignSelf: 'center'
  }
}

const BusinessDetails = props =>
  <TouchableHighlight onPress={() => props.showBusinessDetails(false)}>
    <View style={{ height: 500 }}>
      { props.business.image ? <Image style={style.image} source={{uri: props.business.image.url}}/> : <View style={style.image}/> }
      <DefaultText style={style.title}>{props.business.display}</DefaultText>
    </View>
  </TouchableHighlight>

const mapStateToProps = (state) => ({
  business: state.navigation.businessDetailsVisible
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BusinessDetails)
