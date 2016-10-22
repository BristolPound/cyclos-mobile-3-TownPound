import React from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Carousel from 'react-native-carousel-control'
import DefaultText from '../DefaultText'
import Price from '../Price'
import * as actions from '../../store/reducer/transaction'
import merge from '../../util/merge'
import { isSameMonth, format } from '../../util/date'
import styles, { headerStyles, priceStyles } from './TransactionStyle'

export const toMonthString = month =>
  isSameMonth(month, new Date()) ? 'Spent This Month' : format(month, 'MMMM')

const MonthOption = ({monthTotal, styleIndex}) =>
  <View style={merge(styles.flex, headerStyles.container)}
      key={toMonthString(monthTotal.month)}>
    <DefaultText style={headerStyles.monthlyOption[styleIndex]}>
      {toMonthString(monthTotal.month).toUpperCase()}
    </DefaultText>
    <Price
        color={priceStyles[styleIndex].color}
        price={monthTotal.total}
        size={priceStyles[styleIndex].size}
        smallSize={priceStyles[styleIndex].smallSize}
        center={true} />
  </View>

const TransactionHeader = (props) =>
  <View style={headerStyles.carouselContainer}>
    <Carousel
        pageWidth={150}
        sneak={130}
        initialPage={props.selectedMonthIndex}
        onPageChange={i => props.selectMonth(i)}>
      { props.monthlyTotalSpent.map((monthTotal, index) =>
        <MonthOption
            key={toMonthString(monthTotal.month)}
            monthTotal={monthTotal}
            styleIndex={Math.min(Math.abs(props.selectedMonthIndex - index), 2)} />
      ) }
    </Carousel>
  </View>

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHeader)
