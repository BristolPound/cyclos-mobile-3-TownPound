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

const CAROUSEL_ITEM_WIDTH = 145

export const toMonthString = month =>
  isSameMonth(month, new Date()) ? 'Spent This Month' : format(month, 'MMMM')

const MonthOption = ({monthTotal, isSelected}) => {
  const priceProps = isSelected
    ? {
        color: color.bristolBlue,
        size: 32
    } : {
        color: color.bristolBlue2,
        size: 28
    }
  const textStyle = isSelected
    ? {
      color: color.gray1,
      paddingBottom: 4
    } : {
      color: color.gray2,
      paddingBottom: 2
    }
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

class SpendingHeader extends React.Component {
  render() {
    return  <View style={styles.header.carouselContainer}>
      <Carousel
          itemWidth={CAROUSEL_ITEM_WIDTH}
          containerWidth={Dimensions.get('window').width}
          pageIndex={this.props.selectedMonthIndex}
          onTouchStart={this.props.scrollTransactionsToTop}
          onPageChange={this.props.selectMonth}
          onPress={this.props.selectMonth}>
        { this.props.monthlyTotalSpent.map((monthTotal, index) =>
          <MonthOption
              key={index}
              monthTotal={monthTotal}
              isSelected={this.props.selectedMonthIndex === index} />
        ) }
      </Carousel>
    </View>
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(SpendingHeader)
