import React from 'react'
import _ from 'lodash'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Carousel from 'react-native-carousel-control'

import DefaultText from '../DefaultText'
import Price from '../Price'
import { toMonthString, format, monthRange, floorMonth, convert, currentMonth, isSameMonth, monthDiff } from '../../util/date'
import * as actions from '../../store/reducer/transaction'
import merge from '../../util/merge'

import styles, { headerStyles, priceStyles } from './TransactionStyle'
const last = arr => arr.length > 0 ? arr[arr.length - 1] : undefined
const calculateStyleIndex = num => _.clamp(Math.abs(num), 0, 2)

const MonthOption = ({month, showMonthlyTotal, monthlyTotals, styleIndex}) =>
  <View style={merge(styles.flex, headerStyles.container)} key={toMonthString(month)}>
    <DefaultText style={headerStyles.monthlyOption[styleIndex]}>
      {toMonthString(month).toUpperCase()}
    </DefaultText>
    { showMonthlyTotal
      ? <Price
          color={priceStyles[styleIndex].color}
          price={monthlyTotals[format(month)] || 0}
          size={priceStyles[styleIndex].size}
          smallSize={priceStyles[styleIndex].smallSize}
          center={true} />
      : undefined }
  </View>

const TransactionHeader = (props) => {
  if (props.transactions.length === 0) {
    return null
  }

  const lastTransaction = last(props.transactions)
  const allAvailableMonths = monthRange(floorMonth(convert.fromString(lastTransaction.date)), currentMonth())

  const initPage = _.findIndex(allAvailableMonths, month => isSameMonth(props.selectedMonth, month))

  return <View style={headerStyles.carouselContainer}>
      {props.transactions.length > 0
        ? <Carousel
            initialPage={initPage}
            pageWidth={150}
            sneak={130}
            onPageChange={i => props.setSelectedMonth(allAvailableMonths[i])}>
          { allAvailableMonths.map((month, i) =>
            <MonthOption
                key={toMonthString(month)}
                month={month}
                showMonthlyTotal={props.noMoreTransactionsToLoad || i !== 0}
                monthlyTotals={props.monthlyTotalSpent}
                styleIndex={calculateStyleIndex(monthDiff(props.selectedMonth, month))} />
          ) }
        </Carousel>
      : undefined
    }
    </View>
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHeader)
