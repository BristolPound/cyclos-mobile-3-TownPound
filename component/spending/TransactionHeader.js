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
import styles from './TransactionStyle'

export const toMonthString = month =>
  isSameMonth(month, new Date()) ? 'Spent This Month' : format(month, 'MMMM')

const monthOpacity = (distanceFromCentre) => 1 - distanceFromCentre / 3

const MonthOption = ({monthTotal, distanceFromCentre}) =>
  <View style={merge({opacity: monthOpacity(distanceFromCentre)}, styles.headerStyle.container)}
      key={toMonthString(monthTotal.month)}>
    <DefaultText style={styles.headerStyle.monthlyOption}>
      {toMonthString(monthTotal.month).toUpperCase()}
    </DefaultText>
    <Price
        color={styles.headerStyle.priceStyle.color}
        price={monthTotal.total}
        size={styles.headerStyle.priceStyle.size}
        center={true} />
  </View>

class TransactionHeader extends React.Component {
  render() {
    if (this.refs.carousel) {
      // HACK: The carousel control doesn't have a property for the current page, instead it uses
      // a method. However, this method fires the onPageChange event. This isn't terribly
      // React-like! We have to suppress the event in order to stop causing a state change while in the
      // render-phase (redux doesn't like this!)
      this.suppressPageChange = true
      this.refs.carousel.goToPage(this.props.selectedMonthIndex)
      this.suppressPageChange = false
    }
    return  <View style={styles.headerStyle.carouselContainer}>
      <Carousel
          pageWidth={150}
          sneak={130}
          ref='carousel'
          initialPage={this.props.selectedMonthIndex}
          onPageChange={i => !this.suppressPageChange && this.props.selectMonth(i)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHeader)
