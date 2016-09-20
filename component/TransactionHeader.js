import React from 'react'
import _ from 'lodash'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DefaultText from './DefaultText'
import Price from './Price'

import merge from '../util/merge'
import color from '../util/colors'
import { toMonthString, format, monthRange, floorMonth, convert, currentMonth, isSameMonth } from '../util/date'

import Carousel from 'react-native-carousel-control'
import * as actions from '../store/reducer/transaction'
const last = arr => arr.length > 0 ? arr[arr.length - 1] : undefined

const styles = {
  flex: {
    flex: 1,
  },
  unselectedContainer: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

const MonthOption = ({month, showMonthlyTotal, monthlyTotals, selected}) =>
  <View style={!selected ? merge(styles.flex, styles.unselectedContainer) : styles.flex} key={toMonthString(month)}>
    <DefaultText style={styles.text}>{ toMonthString(month).toUpperCase() }</DefaultText>
    { showMonthlyTotal
      ? <Price price={monthlyTotals[format(month)] || 0} size={selected ? 35 : 20} center={true} color={color.bristolBlue} />
      : undefined }
  </View>

const TransactionHeader = (props) => {
  if (props.transactions.length === 0) {
    return null
  }

  const lastTransaction = last(props.transactions)
  const allAvailableMonths = monthRange(floorMonth(convert.fromString(lastTransaction.date)), currentMonth())

  const initPage = _.findIndex(allAvailableMonths, month => isSameMonth(props.selectedMonth, month))

  return <View style={{height: 70}} >
      <Carousel initialPage={initPage} pageWidth={200} sneak={150} onPageChange={i => props.setSelectedMonth(allAvailableMonths[i])}>
        { allAvailableMonths.map((month, i) =>
          <MonthOption
              key={toMonthString(month)}
              month={month}
              showMonthlyTotal={props.noMoreTransactionsToLoad || i !== 0}
              monthlyTotals={props.monthlyTotalSpent}
              selected={isSameMonth(props.selectedMonth, month)} />
        ) }
      </Carousel>
    </View>
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHeader)
