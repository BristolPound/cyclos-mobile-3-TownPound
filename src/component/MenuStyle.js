import { dimensions, margin, border } from '../util/StyleUtils'
import { screenWidth } from '../util/ScreenSizes'
import Colors from '@Colors/colors'
import commonStyle from './style'

export const TAB_BAR_HEIGHT = 45
const BASELINE = 8
// react native doesn't support adjusting text baseline, so we have to use a magic number
// in order to align the amount with the icons
const MAGIC_NUMBER = 2
const BALANCE_IMAGE_SIZE = 28

const IMAGE_MARGIN = 14
const MENU_WIDTH = screenWidth - 100

const style = {
  separator: {
    ...border(['bottom'], Colors.gray5, 1),
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10,
    marginTop: 10,
    width: MENU_WIDTH
},
  amountContainer: {
    width: MENU_WIDTH,
    backgroundColor: Colors.offWhite,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  amountInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    height: TAB_BAR_HEIGHT
  },
  container: {
    bottom: TAB_BAR_HEIGHT + 1.5,
    top: 0,
    position: 'absolute',
    backgroundColor:  Colors.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyle.shadow
},
  balanceSymbol: {
    paddingRight: 4,
    marginBottom: BASELINE,
    height: BALANCE_IMAGE_SIZE,
    width: BALANCE_IMAGE_SIZE
  },
  amount: {
    marginBottom: BASELINE - MAGIC_NUMBER
  }
}

export default style
