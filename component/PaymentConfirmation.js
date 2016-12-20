import { TouchableHighlight } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import colors from '../util/colors'
import { MultilineText } from './DefaultText'
import { closeConfirmation } from '../store/reducer/navigation'

const style = {
  background: {
    flex: 1,
    backgroundColor: colors.bristolBlue
  }
}

const PaymentConfirmation = (props) =>
  <TouchableHighlight onPress={props.closeConfirmation} style={style.background}>
    <MultilineText> {props.confirmation} </MultilineText>
  </TouchableHighlight>

const mapStateToProps = (state) => ({
  confirmation: state.navigation.confirmation
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ closeConfirmation }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirmation)
