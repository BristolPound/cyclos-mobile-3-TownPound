import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../util/colors'
import commonStyle, { dimensions } from '../style'
import marginOffset from '../../util/marginOffset'

const headerMargin = 24
const listMargin = 14

const styles = {
  header: {
    container: {
      marginTop: marginOffset(0),
    },
    closeButton: {
      position: 'absolute',
      marginLeft: headerMargin,
      marginTop: 40,
      zIndex: 100,
    },
    closeIcon: {
      margin: 10,
      height: 18,
      width: 18
    },
    center: {
      alignItems: 'center',
    },
    expandIcon: {
      marginRight: headerMargin,
      marginTop: 40,
      ...dimensions(16)
    },
    businessLogo: {
      ...dimensions(84),
      marginTop: 58,
      borderColor: colors.bristolBlue,
      borderRadius: 9,
      borderWidth: 2
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
      height: 242,
      width: Dimensions.get('window').width,
      position: 'absolute'
    },
  },
  list: {
    rowContainer: {
      flexDirection: 'row',
      marginLeft: listMargin,
      marginRight: listMargin,
      justifyContent: 'center',
      height: 50
    },
    date: {
      width: 150,
      flex: 1,
      alignSelf: 'center',
      color: colors.offBlack
    },
    transactionNumber: {
      fontFamily: commonStyle.font.museo100,
      fontSize: 16,
      alignSelf: 'center',
      color: colors.gray
    },
    price: {
      flex: 1,
      width: 90,
      alignSelf: 'center'
    },
    separator: {
      marginLeft: listMargin,
      borderColor: colors.gray5,
      borderWidth: StyleSheet.hairlineWidth
    }
  },
  footer: {
    borderTopColor: colors.gray5,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.offWhite,
    flex: 1,
    flexDirection: 'column-reverse'
  },
}

export default styles
