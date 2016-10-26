import color from '../../util/colors'
import merge from '../../util/merge'
import marginOffset from '../../util/marginOffset'
import commonStyle from '../style'

const museo700 = 'MuseoSans-700'
const museo500 = 'MuseoSans-300'
const museo300 = 'MuseoSans-300'

const HEADER_HEIGHT = marginOffset(90)
const IMAGE_SIZE = 42
const IMAGE_MARGIN = 14

const styles = {
  transactionList: {
    marginTop: HEADER_HEIGHT
  },
  container: {
    flex: 1
  },
  separator: {
    marginLeft: IMAGE_SIZE + IMAGE_MARGIN * 2,
    marginRight: 0,
    borderBottomColor: color.gray5,
    borderBottomWidth: 1
  },
  loadingIndicator: {
    flex: 1
  },
  row: {
    container: {
      flexDirection: 'row',
      height: 50,
      paddingRight: 20,
      alignItems: 'center'
    },
    textContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'flex-end'
    },
    image: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      marginLeft: IMAGE_MARGIN,
      marginRight: IMAGE_MARGIN,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: color.offWhite,
      backgroundColor: color.transparent
    },
    text: {
      fontFamily: museo300,
      color: color.offBlack,
      fontSize: 18,
      marginRight: 10,
      flex: 1
    },
    price: {
      flex: 0
    },
  },
  noTransactions: {
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 50,
      backgroundColor: color.offWhite
    },
    text: {
      color: color.gray3
    }
  },
  sectionHeader: {
    container: {
      borderBottomColor: color.gray5,
      borderBottomWidth: 1,
      borderTopColor: color.gray5,
      borderTopWidth: 1,
      height: 34,
      backgroundColor: color.offWhite,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    text: {
      fontFamily: museo700,
      fontSize: 14,
      color: color.gray2,
      marginLeft: 14
    },
  },
  header: {
    carouselContainer: {
      position: 'absolute',
      top: 0,
      height: HEADER_HEIGHT,
      paddingTop: marginOffset(30)
    },
    monthlyOption: {
      fontFamily: museo500,
      fontSize: 15,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      color: color.gray
    },
    priceStyle: {
      color: color.bristolBlue,
      size: 32
    }
  }
}

styles.header.carouselContainer = merge(styles.header.carouselContainer, commonStyle.shadow)

export default styles
