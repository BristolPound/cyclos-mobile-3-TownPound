import React from 'react'
import { View, Dimensions } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Carousel from './Carousel'
import DefaultText from '../DefaultText'
import Price from '../Price'
import * as actions from '../../store/reducer/transaction'
import { isSameMonth, format } from '../../util/date'
import styles from './spendingStyle'
import color from '../../util/colors'

const CAROUSEL_ITEM_WIDTH = Dimensions.get('window').width / 3

export const toMonthString = month => isSameMonth(month, new Date()) ? 'This Month' : format(month, 'MMMM')

const MonthOption = ({monthTotal, isSelected}) => {
  const basicPriceStyle = (color, size) => ({ color, size }),
      priceProps = isSelected ? basicPriceStyle(color.bristolBlue, 32) : basicPriceStyle(color.bristolBlue2, 28)

  const basicTextStyle = (color, paddingBottom) => ({ color, paddingBottom }),
      textStyle = isSelected ? basicTextStyle(color.gray, 4) : basicTextStyle(color.gray2, 2)

  return (
    <View style={{width: CAROUSEL_ITEM_WIDTH}}>
      <DefaultText style={{...styles.header.monthlyOption, ...textStyle}}>
        {toMonthString(monthTotal.month).toUpperCase()}
      </DefaultText>
      <Price
          {...priceProps}
          price={monthTotal.total}
          center={true} />
    </View>
  )
}

export const SpendingHeader = props =>
  <Carousel
      style={styles.header.carousel}
      itemWidth={CAROUSEL_ITEM_WIDTH}
      containerWidth={Dimensions.get('window').width}
      pageIndex={props.selectedMonthIndex}
      onTouchStart={props.scrollTransactionsToTop}
      onPageChange={props.selectMonth}
      onPress={props.selectMonth}>
      { props.monthlyTotalSpent.map((monthTotal, index) =>
          <MonthOption
              key={index}
              monthTotal={monthTotal}
              isSelected={props.selectedMonthIndex === index} />
      ) }
  </Carousel>

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(SpendingHeader)
