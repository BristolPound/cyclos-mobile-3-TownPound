import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import commonStyle from '../style'
import ScreenSizes from '../../util/ScreenSizes'

const MARGIN_SIZE = 10
export const SEARCH_BAR_MARGIN_TOP_IOS = 35

export const SEARCH_BAR_MARGIN = marginOffset(SEARCH_BAR_MARGIN_TOP_IOS)
export const SEARCH_BAR_HEIGHT = ScreenSizes.isSmall() ? 44 : 48
export const MAP_HEIGHT = ScreenSizes.isSmall() ? 220 : 275

const styles = {
  searchTab: {
    expandPanel: {
      left: MARGIN_SIZE,
      right: MARGIN_SIZE,
      position: 'absolute',
    },
    searchBar: {
      height: SEARCH_BAR_HEIGHT,
      marginLeft: MARGIN_SIZE,
      marginRight: MARGIN_SIZE,
      marginTop: SEARCH_BAR_MARGIN,
      backgroundColor: color.white,
      flexDirection: 'row',
      ...commonStyle.dropshadow
    },
  }
}

export default styles
