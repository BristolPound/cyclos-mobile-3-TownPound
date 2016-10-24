import color from '../../util/colors'

const SEARCH_BAR_HEIGHT = 50
const MARGIN_SIZE = 10
const LIST_BORDER_RADIUS = 8

const styles = {
  expandHeader: {
    container: {
      height: 40,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: color.gray5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5
    },
    topBorderCurve: {
      borderTopLeftRadius: LIST_BORDER_RADIUS,
      borderTopRightRadius: LIST_BORDER_RADIUS,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0
    },
    noBorderCurve: {
      borderRadius: 0
    }
  },
  listItem: {
    container: {
      flexDirection: 'row',
      paddingLeft: 9,
      paddingTop: 8,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomColor: color.gray5,
      borderLeftColor: color.gray5,
      borderRightColor: color.gray5,
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
      bottom: 0,
      borderRadius: 5
    },
    searchBar: {
      height: SEARCH_BAR_HEIGHT,
      marginLeft: MARGIN_SIZE,
      marginRight: MARGIN_SIZE,
      backgroundColor: 'white',
      flexDirection: 'row'
    }
  }
}

export default styles
