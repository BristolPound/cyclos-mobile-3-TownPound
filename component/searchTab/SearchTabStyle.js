import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import style, { dimensions } from '../style'
import ScreenSizes from '../../util/ScreenSizes'

const MARGIN_SIZE = 10
const SEARCH_BAR_MARGIN_TOP_IOS = 35

export const SEARCH_BAR_MARGIN = marginOffset(SEARCH_BAR_MARGIN_TOP_IOS)
export const ROW_HEIGHT = ScreenSizes.isSmall() ? 50 : 60
export const SEARCH_BAR_HEIGHT = ScreenSizes.isSmall() ? 44 : 48
export const MAP_HEIGHT = ScreenSizes.isSmall() ? 220 : 275

const styles = {
  // The business list can be selected or otherwise.
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
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0
    },
    noBorderCurve: {
      borderRadius: 0
    }
  },
  listItem: {
    // to be merged with container.
    // If the container is unselected, then it's adjacent, so needs a separator.
    // If the container is selected then we need to round it to match whatever is above it.
    containerSelected: {
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
      borderBottomWidth: 0,
    },
    container: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: color.offWhite,
      backgroundColor: color.white,
      height: ROW_HEIGHT,
    },
    // The container contains a color coded margin, an image and a title.
    status: {
      width: 5,
    },
    statusSelected: {
      backgroundColor: color.bristolBlue,
    },
    contents: {
      flex: 1,
      flexDirection: 'row',
      paddingLeft: 5,
      paddingTop: ScreenSizes.isSmall() ? 4 : 8,
      paddingBottom: ScreenSizes.isSmall() ? 4 : 8,
    },
    image: {
      ...dimensions(ScreenSizes.isSmall() ? 42 : 44),
      paddingRight: 5,
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
    selected: {
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
