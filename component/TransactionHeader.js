import React from 'react'
import { View, TouchableHighlight } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toMonthString, isCurrentMonth, format } from '../util/date'
// import moment from 'moment'

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

const MonthlyTotal = ({style, selectedMonth, monthlyTotals}) =>
  <DefaultText style={style}>£{(-monthlyTotals[format(selectedMonth)] || 0).toFixed(2)}</DefaultText>

const TransactionHeader = (props) => {
  const isOnCurrentMonth = isCurrentMonth(props.selectedMonth)
  return <View style={{flexDirection: 'row', height: 50}}>
    <NavBarButton style={styles.flex} onPress={() => props.fetchPreviousMonth()}>
      <DefaultText style={styles.text}>Prev</DefaultText>
    </NavBarButton>
    <View style={styles.flex}>
      <DefaultText style={styles.text}>{ toMonthString(props.selectedMonth) }</DefaultText>
      <MonthlyTotal style={styles.text} selectedMonth={props.selectedMonth} monthlyTotals={props.monthlyTotalSpent} />
    </View>
    <NavBarButton style={styles.flex} onPress={() => isOnCurrentMonth ? undefined : props.nextMonth()}>
      { isOnCurrentMonth
        ? undefined
        : <DefaultText style={styles.text}>Next</DefaultText>}
    </NavBarButton>
  </View>
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({selectedMonth: state.transaction.selectedMonth, monthlyTotalSpent: state.transaction.monthlyTotalSpent})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHeader)
