import React from 'react'
import { View, TouchableHighlight } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import dateFormat from 'dateformat'

import DefaultText from './DefaultText'
import * as actions from '../store/reducer/transaction'

const styles = {
  flex: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
  }
}

const NavBarButton = ({style, children, onPress}) =>
  <TouchableHighlight style={style} onPress={onPress}>
    <View>
      {children}
    </View>
  </TouchableHighlight>

const TransactionHeader = (props) => {
  const currentDate = new Date()
  const isOnCurrentMonth = currentDate.getMonth() === props.selectedMonth.month && currentDate.getFullYear() === props.selectedMonth.year
  return <View style={{flexDirection: 'row', height: 50}}>
    <NavBarButton style={styles.flex} onPress={() => props.previousMonth()}>
      <DefaultText style={styles.text}>Prev</DefaultText>
    </NavBarButton>
    <View style={styles.flex}>
      <DefaultText style={styles.text}>{isOnCurrentMonth ? 'This Month' : dateFormat(new Date(props.selectedMonth.year, props.selectedMonth.month, 10), 'mmmm, yyyy')}</DefaultText>
    </View>
    <NavBarButton style={styles.flex} onPress={() => isOnCurrentMonth ? undefined : props.nextMonth()}>
      { isOnCurrentMonth
        ? undefined
        : <DefaultText style={styles.text}>Next</DefaultText>}
    </NavBarButton>
  </View>
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({selectedMonth: state.transaction.selectedMonth})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHeader)
