import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import commonStyle from '../style'
import { dimensions, margin, padding, horizontalAbsolutePosition, verticalAbsolutePosition } from '../../util/StyleUtils'
import { isScreenSmall, screenHeight } from '../../util/ScreenSizes'
import { TAB_BAR_HEIGHT } from '../tabbar/TabBar'

const MARGIN_SIZE = 10
const SEARCH_INPUT_WIDTH = 330
const CLOSE_ICON_WIDTH = 50
const SEARCH_BAR_MARGIN_IOS = 35

export const SEARCH_BAR_MARGIN = marginOffset(SEARCH_BAR_MARGIN_IOS)
export const SEARCH_BAR_HEIGHT = isScreenSmall ? 44 : 48

export const maxExpandedHeight = screenHeight - SEARCH_BAR_MARGIN - SEARCH_BAR_HEIGHT - TAB_BAR_HEIGHT
export const maxCollapsedHeight = 45/100 * screenHeight - TAB_BAR_HEIGHT

const styles = {
  searchTab: {
    expandPanel: {
      ...horizontalAbsolutePosition(MARGIN_SIZE, MARGIN_SIZE)
    },
    searchBar: {
      ...margin(SEARCH_BAR_MARGIN, MARGIN_SIZE, 0, MARGIN_SIZE),
      ...commonStyle.shadow,
      height: SEARCH_BAR_HEIGHT,
      backgroundColor: color.white,
      flexDirection: 'row'
    },
    textInput: {
      ...margin(5, 9),
      ...padding(2),
      ...dimensions(SEARCH_INPUT_WIDTH - CLOSE_ICON_WIDTH, SEARCH_BAR_HEIGHT - 10),
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
      ...dimensions(18),
      right: 65,
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
