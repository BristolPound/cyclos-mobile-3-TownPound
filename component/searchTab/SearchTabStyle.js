import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import commonStyle from '../style'
import { dimensions, margin, padding, horizontalAbsolutePosition } from '../../util/StyleUtils'
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
      backgroundColor: color.white,
      color: color.bristolBlue,
      flex: 1
    },
    closeButton: {
      alignSelf: 'center',
      borderLeftWidth: 1,
      borderLeftColor: color.gray5,
    },
    clearTextButton: {
      ...dimensions(20),
      alignSelf: 'center',
      right: 13,
      borderRadius: 10,
      backgroundColor: color.gray3
    },
    clearText: {
      ...margin(1, 0, 0, 6.5),
      color: color.white,
      fontSize: 14,
      top: 0
    },
    searchHeaderText: {
      ...commonStyle.sectionHeader.text,
      ...margin(20, 0, 10, 14),
      backgroundColor: color.transparent
    },
    hide: {
      height: 0
    }
  }
}

export default styles
