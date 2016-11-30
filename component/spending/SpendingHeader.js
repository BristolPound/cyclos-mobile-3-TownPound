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

const CAROUSEL_ITEM_WIDTH = 150

export const toMonthString = month =>
  isSameMonth(month, new Date()) ? 'Spent This Month' : format(month, 'MMMM')

const monthOpacity = (distanceFromCentre) => 1 - distanceFromCentre / 3

const MonthOption = ({monthTotal, distanceFromCentre}) =>
  <View style={{
        opacity: monthOpacity(distanceFromCentre),
        width: CAROUSEL_ITEM_WIDTH,
      }}
      key={toMonthString(monthTotal.month)}>
    <DefaultText style={styles.header.monthlyOption}>
      {toMonthString(monthTotal.month).toUpperCase()}
    </DefaultText>
    <Price
        color={styles.header.priceStyle.color}
        price={monthTotal.total}
        size={styles.header.priceStyle.size}
        center={true} />
  </View>

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
              key={toMonthString(monthTotal.month)}
              monthTotal={monthTotal}
              distanceFromCentre={Math.min(Math.abs(this.props.selectedMonthIndex - index), 2)} />
        ) }
      </Carousel>
    </View>
  }
}


const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(SpendingHeader)
