import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { openLoginForm } from '../../store/reducer/login'
import { Overlay } from '../common/Overlay'

import color from '../../util/colors'

const LoginOverlay = (props) =>
  <Overlay overlayVisible={props.loginFormOpen}
           onPress={() => props.openLoginForm(false)}
           underlayColor={color.transparent} />

const mapDispatchToProps = (dispatch) => bindActionCreators({ openLoginForm }, dispatch)
const mapStateToProps = (state) => ({ loginFormOpen: state.login.loginFormOpen })

export default connect(mapStateToProps, mapDispatchToProps)(LoginOverlay)
