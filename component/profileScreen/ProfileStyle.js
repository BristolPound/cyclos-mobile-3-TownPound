import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../util/colors'
import commonStyle from '../style'
import { dimensions, margin, border } from '../../util/StyleUtils'

const headerMargin = 24
const listMargin = 14
const screenWidth = Dimensions.get('window').width

const styles = {
  header: {
    closeButton: {
        marginTop: 32,
        marginLeft: 8,
        zIndex: 100,
    },
    center: {
      alignItems: 'center',
    },
    expandIcon: {
      ...dimensions(16),
      ...margin(40, headerMargin, 0, 0)
    },
    businessLogo: {
      ...dimensions(84)
    },
    title: {
      fontFamily: commonStyle.font.museo500,
      marginTop: 8,
      fontSize: 20,
      color: colors.offBlack
    },
    subtitle: {
      marginBottom: 46,
      fontSize: 18,
      color: colors.gray
    },
    backgroundImage: {
      ...dimensions(screenWidth, 242),
      position: 'absolute'
    },
  },
  list: {
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      height: 50
    },
    columnContainer: {
      flexDirection: 'column',
      justifyContent: 'center'
    },
    date: {
      width: screenWidth / 3 + 30,
      flex: 1,
      alignSelf: 'center',
      color: colors.offBlack,
      paddingLeft: 12
    },
    time: {
      width: screenWidth / 3 - 20,
      fontFamily: commonStyle.font.museo100,
      flex: 1,
      alignSelf: 'center',
      textAlign: 'center',
      color: colors.gray
    },
    transactionNumber: {
      fontFamily: commonStyle.font.museo100,
      fontSize: 16,
      alignSelf: 'center',
      color: colors.gray
    },
    price: {
      flex: 1,
      width: screenWidth / 3 - 10,
      alignSelf: 'center',
      paddingRight: 12
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
