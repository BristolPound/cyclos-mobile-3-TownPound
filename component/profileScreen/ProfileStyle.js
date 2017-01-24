import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../util/colors'
import commonStyle from '../style'
import { dimensions, margin, border } from '../../util/StyleUtils'

const headerMargin = 24
const screenWidth = Dimensions.get('window').width
const listMargin = 4 + screenWidth / 40

const styles = {
  header: {
    closeButton: {
        marginTop: 15,
        marginLeft: 8,
        zIndex: 100,
        position: 'absolute'
    },
    expandIcon: {
      ...dimensions(16),
      ...margin(40, headerMargin, 0, 0)
    },
    businessLogo: {
      ...dimensions(84),
      marginTop: 58
    },
    title: {
      fontFamily: commonStyle.font.museo500,
      marginTop: 8,
      fontSize: 20,
    },
    subtitle: {
      fontSize: 18,
      color: colors.gray
    },
    backgroundImage: {
      ...dimensions(screenWidth, 248),
      position: 'absolute'
    },
    backgroundImageContainer: {
      width: screenWidth,
    }
  },
  list: {
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      height: 50
    },
    leftColumn: {
      width: screenWidth / 3,
      flex: 1,
      paddingLeft: listMargin,
      alignSelf: 'center'
    },
    dateNumbers: {
      marginTop: 5,
      fontFamily: commonStyle.font.museo500
    },
    dateLetters: {
      marginTop: 5,
    },
    day: {
      position: 'absolute',
      fontSize: 17,
      top: 24,
      left: listMargin
    },
    midColumnOuter: {
      flex: 1,
      width: screenWidth / 3 ,
      alignItems: 'center',
      alignSelf: 'center'
    },
    midColumnInner: {
      alignSelf: 'center'
    },
    timeText: {
      fontFamily: commonStyle.font.museo500,
    },
    idText: {
      fontFamily: commonStyle.font.museo100,
      fontSize: 16,
    },
    price: {
      flex: 1,
      width: screenWidth / 3,
      alignSelf: 'center',
      paddingRight: listMargin
    },
    separator: {
      ...border(['top', 'right', 'bottom', 'left'], colors.gray5, StyleSheet.hairlineWidth),
      marginLeft: listMargin
    }
  },
  footer: {
    ...border(['top'], colors.gray5, StyleSheet.hairlineWidth),
    backgroundColor: colors.offWhite,
    flex: 1,
    flexDirection: 'column-reverse'
  },
}

export default styles
