import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import style from '../style'
import ScreenSizes from '../../util/ScreenSizes'

const MARGIN_SIZE = 10
const SEARCH_BAR_MARGIN_TOP_IOS = 35

export const SEARCH_BAR_MARGIN = marginOffset(SEARCH_BAR_MARGIN_TOP_IOS)
export const ROW_HEIGHT = ScreenSizes.isSmall() ? 50 : 60
export const SEARCH_BAR_HEIGHT = ScreenSizes.isSmall() ? 44 : 48
export const MAP_HEIGHT = ScreenSizes.isSmall() ? 220 : 275

const styles = {
  expandHeader: {
    container: {
      height: 40,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: color.gray5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5
    },
    topBorderCurve: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0
    },
    noBorderCurve: {
      borderRadius: 0
    }
  },
  listItem: {
    container: {
      flexDirection: 'row',
      paddingLeft: 10,
      paddingTop: ScreenSizes.isSmall() ? 4 : 8,
      paddingBottom: ScreenSizes.isSmall() ? 4 : 8,
      borderBottomWidth: 1,
      borderBottomColor: color.offWhite,
      backgroundColor: color.white,
      height: ROW_HEIGHT
    },
    image: {
      width: ScreenSizes.isSmall() ? 42 : 44,
      height: ScreenSizes.isSmall() ? 42 : 44,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: color.offWhite
    },
    verticalStack: {
      flex: 1,
      flexDirection: 'column',
      paddingLeft: 10,
      paddingRight: 10
    },
    title: {
      fontSize: ScreenSizes.isSmall() ? 16 : 18,
      marginTop: 2
    },
    shortDisplay: {
      fontSize: 14,
      color: color.gray3,
      marginBottom: 6
    },
    selectedBusiness: {
      marginBottom: 10
    }
  },
  searchTab: {
    list: {
      position: 'absolute',
      top: 35 + SEARCH_BAR_HEIGHT,
      left: MARGIN_SIZE,
      right: MARGIN_SIZE,
      bottom: 0,
      borderRadius: 5,
      ...style.dropshadow
    },
    searchBar: {
      height: SEARCH_BAR_HEIGHT,
      marginLeft: MARGIN_SIZE,
      marginRight: MARGIN_SIZE,
      marginTop: SEARCH_BAR_MARGIN,
      backgroundColor: color.white,
      flexDirection: 'row',
      ...style.dropshadow
    },
  }
}

export default styles
