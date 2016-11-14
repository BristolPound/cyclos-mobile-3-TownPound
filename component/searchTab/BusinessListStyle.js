import color from '../../util/colors'
import ScreenSizes from '../../util/ScreenSizes'
import {dimensions} from '../style'

export const ROW_HEIGHT = ScreenSizes.isSmall() ? 50 : 60
export const BUSINESS_LIST_SELECTED_GAP = 10

const styles = {
  listItem: {
    // to be merged with container.
    // If the container is unselected, then it's adjacent, so needs a separator.
    // If the container is selected then we need to round it to match whatever is above it.
    containerSelected: {
      borderRadius: 2,
      borderTopWidth: 0,
    },
    containerTopOfList: {
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
      borderTopWidth: 0,
    },
    container: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: color.offWhite,
      height: ROW_HEIGHT,
    },
    containerHighlighted: {
      backgroundColor: color.offWhite
    },
    // The container contains a color coded margin, an image and a title.
    status: {
      width: 5,
    },
    statusSelected: {
      backgroundColor: color.bristolBlue,
      borderBottomLeftRadius: 2,
      borderTopLeftRadius: 2
    },
    statusTopOfList: {
      borderTopLeftRadius: 2
    },
    contents: {
      flex: 1,
      flexDirection: 'row',
      paddingLeft: 5,
      paddingTop: ScreenSizes.isSmall() ? 4 : 8,
      paddingBottom: ScreenSizes.isSmall() ? 4 : 8,
    },
    image: {
      paddingRight: 5,
      ...dimensions(ScreenSizes.isSmall() ? 42 : 44),
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
    }
  },
}

export default styles
