import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import style from '../style'

const SEARCH_BAR_HEIGHT = 48
const MARGIN_SIZE = 10
const SEARCH_BAR_MARGIN_TOP_IOS = 35

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
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
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
      paddingLeft: 10,
      paddingTop: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: color.offWhite,
      backgroundColor: color.white,
      height: 60
    },
    image: {
      width: 44,
      height: 44,
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
      fontSize: 18,
      marginTop: 2
    },
    shortDisplay: {
      fontSize: 14,
      color: color.gray3,
      marginBottom: 6
    }
  },
  searchTab: {
    list: {
      position: 'absolute',
      top: 35 + SEARCH_BAR_HEIGHT,
      left: MARGIN_SIZE,
      right: MARGIN_SIZE,
      bottom: 0,
      borderRadius: 5,
      ...style.dropshadow
    },
    searchBar: {
      height: SEARCH_BAR_HEIGHT,
      marginLeft: MARGIN_SIZE,
      marginRight: MARGIN_SIZE,
      marginTop: marginOffset(SEARCH_BAR_MARGIN_TOP_IOS),
      backgroundColor: color.white,
      flexDirection: 'row',
      ...style.dropshadow
    },
  }
}

export default styles
