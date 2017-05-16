import React from 'react'
import { View, Dimensions } from 'react-native'
import Carousel from './Carousel'
import DefaultText from '../DefaultText'
import Price from '../Price'
import { isSameMonth, format } from '../../util/date'
import styles from './spendingStyle'
import color from '../../util/colors'

const CAROUSEL_ITEM_WIDTH = Dimensions.get('window').width / 3

export const toMonthString = month => isSameMonth(month, new Date()) ? 'This Month' : format(month, 'MMMM')

const MonthOption = ({ monthTotal, isSelected, highlight }) => {
  const basicPriceStyle = (color, size) => ({ color, size })
  const priceProps = isSelected ? basicPriceStyle(color.bristolBlue, 32) : basicPriceStyle(color.bristolBlue2, 28)

  const basicTextStyle = (color, paddingBottom) => ({ color, paddingBottom })
  const textStyle = isSelected ? basicTextStyle(color.gray, 4) : basicTextStyle(color.gray2, 2)

  return (
      <View style={{ width: CAROUSEL_ITEM_WIDTH, backgroundColor: highlight ? color.offWhite : color.white }} >
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
  constructor() {
    super()
    this.state = { highlightIndex: -1 }
  }
  onTouchStart(index) {
    this.setState({ highlightIndex: index })
  }
  onPageChange(index) {
    this.setState({ highlightIndex: -1 })
    this.props.selectMonth(index)
  }
  render() {
    const { props, state } = this
    return (
      <Carousel
          style={styles.header.carousel}
          itemWidth={CAROUSEL_ITEM_WIDTH}
          containerWidth={Dimensions.get('window').width}
          pageIndex={props.selectedMonthIndex}
          onPageChange={(index) => this.onPageChange(index)}
          onTouchStart={(index) => this.onTouchStart(index)}
          onMove={() => this.setState({ highlightIndex: -1 })}
          onPress={(index) => this.onPageChange(index)}>
          {props.monthlyTotalSpent.map((monthTotal, index) =>
            <MonthOption
                key={index}
                monthTotal={monthTotal}
                isSelected={props.selectedMonthIndex === index}
                highlight={state.highlightIndex === index}/>
          )}
      </Carousel>
    )
  }
}

export default SpendingHeader
