import color from '../../util/colors'
import { MARGIN_SIZE, SEARCH_BAR_HEIGHT } from './constants'

const styles = {
  listItem: {
    container: {
      flexDirection: 'row',
      paddingLeft: 9,
      paddingTop: 8,
      borderBottomWidth: 1,
      borderBottomColor: color.gray5,
      backgroundColor: 'white',
      height: 59
    },
    image: {
      width: 42,
      height: 42,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: color.offWhite
    },
    verticalStack: {
      flexDirection: 'column',
      paddingLeft: 10
    },
    title: {
      fontSize: 18,
      marginTop: 3,
      marginBottom: 1
    },
    shortDisplay: {
      fontSize: 14,
      color: color.grey3
    }
  },
  searchTab: {
    list: {
      position: 'absolute',
      top: MARGIN_SIZE + SEARCH_BAR_HEIGHT,
      left: MARGIN_SIZE,
      right: MARGIN_SIZE,
      bottom: 0
    },
    searchBar: {
      height: SEARCH_BAR_HEIGHT,
      margin: MARGIN_SIZE,
      backgroundColor: 'white',
      flexDirection: 'row'
    }
  }
}

export default styles
