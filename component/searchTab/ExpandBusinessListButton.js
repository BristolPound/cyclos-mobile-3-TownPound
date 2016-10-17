import React from 'react'
import { TouchableHighlight } from 'react-native'
import merge from '../../util/merge'
import { connect } from 'react-redux'
import styles from './SearchTabStyle'
import DefaultText from '../DefaultText'
import colors from '../../util/colors'

const ExpandBusinessListButton = (props) =>
  <TouchableHighlight
        style={merge(styles.expandHeader.container, !props.business.businessListExpanded ? styles.expandHeader.topBorderCurve : styles.expandHeader.noBorderCurve)}
        underlayColor={colors.gray5}
        onPress={props.onPress}>
    <DefaultText>
      {props.business.businessListExpanded ? 'Show Map' : 'Show Nearby List'}
    </DefaultText>
  </TouchableHighlight>

const mapStateToProps = (state) => ({business: state.business})

export default connect(mapStateToProps)(ExpandBusinessListButton)
