import React from 'react'
import { View, TouchableHighlight } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toMonthString, isCurrentMonth, format, isSameMonth } from '../util/date'
// import moment from 'moment'

import DefaultText from './DefaultText'
import * as actions from '../store/reducer/transaction'
const last = arr => arr.length > 0 ? arr[arr.length - 1] : undefined

const styles = {
  flex: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
  }
}

const NavBarButton = ({text, hide, onPress}) =>
  <TouchableHighlight style={styles.flex} onPress={onPress}>
    <View>
      { hide
        ? undefined
        : <DefaultText style={styles.text}>{text}</DefaultText>}
    </View>
  </TouchableHighlight>

const MonthlyTotal = ({style, selectedMonth, monthlyTotals}) =>
  <DefaultText style={style}>£{(-monthlyTotals[format(selectedMonth)] || 0).toFixed(2)}</DefaultText>

const TransactionHeader = props => {
  const buttonDisabled = props.loadingTransactions || props.loadingMoreTransactions || props.refreshing
  const nextButtonHidden = isCurrentMonth(props.selectedMonth)
  const lastTransaction = last(props.transactions)
  const prevButtonHidden = !lastTransaction || (props.noMoreTransactionsToLoad && isSameMonth(props.selectedMonth, last(props.transactions).date))

  return (<View style={{flexDirection: 'row', height: 50}}>
      <NavBarButton text='Prev' hide={prevButtonHidden} onPress={ () => buttonDisabled || prevButtonHidden ? undefined : props.fetchPreviousMonth() } />
      <View style={styles.flex}>
        <DefaultText style={styles.text}>{ toMonthString(props.selectedMonth) }</DefaultText>
      <MonthlyTotal style={styles.text} selectedMonth={props.selectedMonth} monthlyTotals={props.monthlyTotalSpent} />
      </View>
      <NavBarButton text='Next' hide={nextButtonHidden} onPress={ () => buttonDisabled || nextButtonHidden ? undefined : props.nextMonth() }/>
    </View>)
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHeader)
