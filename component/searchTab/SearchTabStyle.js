import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import commonStyle from '../style'
import { margin, padding, horizontalAbsolutePosition, verticalAbsolutePosition } from '../../util/StyleUtils'
import ScreenSizes from '../../util/ScreenSizes'
import { Dimensions } from 'react-native'
import { TAB_BAR_HEIGHT } from '../tabbar/TabBar'

const MARGIN_SIZE = 10
const SEARCH_INPUT_WIDTH = 330
const CLOSE_ICON_WIDTH = 50
export const SEARCH_BAR_MARGIN_TOP_IOS = 35

export const SEARCH_BAR_MARGIN = marginOffset(SEARCH_BAR_MARGIN_TOP_IOS)
export const SEARCH_BAR_HEIGHT = ScreenSizes.isSmall() ? 44 : 48
export const MAP_HEIGHT = ScreenSizes.isSmall() ? 220 : 275

// Here we use SEARCH_BAR_MARGIN_TOP_IOS because
// Dimensions.get('window').height includes the status bar, even on android
export const maxExpandedHeight = Dimensions.get('window').height - SEARCH_BAR_MARGIN_TOP_IOS - SEARCH_BAR_HEIGHT - TAB_BAR_HEIGHT
export const maxCollapsedHeight = maxExpandedHeight - MAP_HEIGHT

const styles = {
  searchTab: {
    expandPanel: {
      ...horizontalAbsolutePosition(MARGIN_SIZE, MARGIN_SIZE)
    },
    searchBar: {
      ...margin(SEARCH_BAR_MARGIN, MARGIN_SIZE, 0, MARGIN_SIZE),
      height: SEARCH_BAR_HEIGHT,
      backgroundColor: color.white,
      ...commonStyle.shadow,
      flexDirection: 'row',
    },
    textInput: {
      ...margin(5, 9),
      ...padding(2),
      width: SEARCH_INPUT_WIDTH - CLOSE_ICON_WIDTH,
      height: SEARCH_BAR_HEIGHT - 10,
      fontSize: 16,
      color: color.bristolBlue,
      backgroundColor: color.white,
      flex: 1
    },
    closeButton: {
      ...margin(0, 0, 0, 0),
      ...padding(3, 8, 3, 18),
      right: 0,
      borderLeftWidth: 1,
      borderLeftColor: color.gray5
    },
    clearTextButton: {
      ...padding(0, 2, 2, 5),
      ...verticalAbsolutePosition(12, 9),
      right: 65,
      width: 18,
      height: 18,
      borderRadius: 10,
      backgroundColor: color.gray3
    },
    clearText: {
        color: color.white,
        fontSize: 14,
        top: 0
    },
    list: {
      ...commonStyle.shadow,
      ...margin(0, MARGIN_SIZE, 0, MARGIN_SIZE)
    },
    searchHeaderText: {
      ...commonStyle.sectionHeader.text,
      ...margin(20, 0, 10, 14)
    },
    hide: {
      height: 0
    }
  }
}

export default styles
