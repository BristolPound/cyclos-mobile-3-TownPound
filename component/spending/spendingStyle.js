import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import commonStyle, { dimensions } from '../style'
import { baselineDeltaForFonts } from '../DefaultText'

const HEADER_HEIGHT = marginOffset(90)
const IMAGE_SIZE = 42
const IMAGE_MARGIN = 14

const styles = {
  list: {
    marginTop: HEADER_HEIGHT,
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
      ...dimensions(IMAGE_SIZE),
      marginLeft: IMAGE_MARGIN,
      marginRight: IMAGE_MARGIN,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: color.offWhite,
      backgroundColor: color.transparent
    },
    text: {
      fontFamily: commonStyle.font.museo300,
      // the offset required to align this text (18px) with the price (22px)
      marginBottom: baselineDeltaForFonts(22, 18),
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
  sectionHeader: commonStyle.sectionHeader,
  header: {
    carouselContainer: {
      position: 'absolute',
      top: 0,
      height: HEADER_HEIGHT,
      paddingTop: marginOffset(30),
      ...commonStyle.shadow
    },
    monthlyOption: {
      fontFamily: commonStyle.font.museo500,
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

export default styles
