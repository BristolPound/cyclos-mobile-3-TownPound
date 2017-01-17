import { Dimensions } from 'react-native'

import color from '../../util/colors'
import commonStyle from '../style'
import { dimensions, margin, padding, horizontalAbsolutePosition } from '../../util/StyleUtils'
import { isScreenSmall, screenHeight } from '../../util/ScreenSizes'
import { TAB_BAR_HEIGHT } from '../tabbar/TabBar'

const MARGIN_SIZE = 10
const CLEAR_TEXT_ICON_WIDTH = 46
const NEARBY_WIDTH = 39
export const SEARCH_BAR_MARGIN = 35
const SEARCH_BAR_WIDTH = Dimensions.get('window').width - 2 * MARGIN_SIZE

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
      ...dimensions(SEARCH_BAR_WIDTH, SEARCH_BAR_HEIGHT),
      ...commonStyle.shadow,
      backgroundColor: color.white,
      flexDirection: 'row'
    },
    nearbyButton: {
      width: NEARBY_WIDTH,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textInput: {
      ...margin(5, 9),
      ...padding(2),
      ...dimensions(SEARCH_BAR_WIDTH - CLEAR_TEXT_ICON_WIDTH - SEARCH_BAR_HEIGHT - NEARBY_WIDTH, SEARCH_BAR_HEIGHT - 10),
      fontSize: 16,
      backgroundColor: color.white,
      color: color.bristolBlue,
    },
    closeButton: {
      alignSelf: 'center',
      borderLeftWidth: 1,
      borderLeftColor: color.gray5,
      right: 0,
      position: 'absolute',
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
