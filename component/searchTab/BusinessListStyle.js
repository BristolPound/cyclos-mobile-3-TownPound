import color from '../../util/colors'
import { isScreenSmall } from '../../util/ScreenSizes'
import { dimensions, padding, border } from '../../util/StyleUtils'

export const ROW_HEIGHT = isScreenSmall ? 50 : 60
const CONTENT_PADDING = isScreenSmall ? 4 : 8
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
      ...border(['top'], color.offWhite, 1),
      flexDirection: 'row',
      height: ROW_HEIGHT,
      backgroundColor: color.transparent
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
      ...padding(CONTENT_PADDING, 0, CONTENT_PADDING, 5),
      flex: 1,
      flexDirection: 'row',
    },
    image: {
      ...dimensions(isScreenSmall ? 42 : 44),
      paddingRight: 5,
      borderRadius: 5,
    },
    verticalStack: {
      ...padding(0, 10, 0, 10),
      flex: 1,
      flexDirection: 'column'
    },
    title: {
      fontSize: isScreenSmall ? 16 : 18,
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
