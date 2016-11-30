import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import commonStyle, { margin } from '../style'
import ScreenSizes from '../../util/ScreenSizes'
import { Dimensions } from 'react-native'
import { TAB_BAR_HEIGHT } from '../tabbar/TabBar'

const MARGIN_SIZE = 10
export const SEARCH_BAR_MARGIN_TOP_IOS = 35

export const SEARCH_BAR_MARGIN = marginOffset(SEARCH_BAR_MARGIN_TOP_IOS)
export const SEARCH_BAR_HEIGHT = 0  // ScreenSizes.isSmall() ? 44 : 48 - For use when search is implemented
export const MAP_HEIGHT = ScreenSizes.isSmall() ? 220 : 275

// Here we use SEARCH_BAR_MARGIN_TOP_IOS because
// Dimensions.get('window').height includes the status bar, even on android
export const maxExpandedHeight = Dimensions.get('window').height - SEARCH_BAR_MARGIN_TOP_IOS - SEARCH_BAR_HEIGHT - TAB_BAR_HEIGHT
export const maxCollapsedHeight = maxExpandedHeight - MAP_HEIGHT

const styles = {
  searchTab: {
    expandPanel: {
      position: 'absolute',
      left: MARGIN_SIZE,
      right: MARGIN_SIZE
    },
    searchBar: {
      ...margin(SEARCH_BAR_MARGIN, MARGIN_SIZE, 0, MARGIN_SIZE),
      height: SEARCH_BAR_HEIGHT,
      backgroundColor: color.white,
      flexDirection: 'row',
      ...commonStyle.shadow
    },
  }
}

export default styles
