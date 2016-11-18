import { StyleSheet } from 'react-native'
import colors from '../../util/colors'
import commonStyle, { dimensions } from '../style'

const headerMargin = 24
const listMargin = 14

const styles = {
  flex: {flex: 1},
  rowLayout: {flexDirection: 'row', justifyContent: 'space-between', flex: 1},
  header: {
    topSpace: {
      height: 58
    },
    closeButton: {
      marginLeft: headerMargin,
      marginTop: 40,
      height: 38,
      width: 38
    },
    closeIcon: {
      margin: 10,
      height: 18,
      width: 18
    },
    expandIcon: {
      marginRight: headerMargin,
      marginTop: 40,
      ...dimensions(16)
    },
    businessLogo: {
      ...dimensions(84),
      alignSelf: 'center',
      borderColor: colors.bristolBlue,
      borderRadius: 5,
      borderWidth: 2
    },
    title: {
      fontFamily: commonStyle.font.museo500,
      alignSelf: 'center',
      marginTop: 8,
      fontSize: 20,
      color: colors.offBlack,
      backgroundColor: colors.transparent
    },
    subtitle: {
      alignSelf: 'center',
      marginBottom: 46,
      fontSize: 18,
      color: colors.gray,
      backgroundColor: colors.transparent
    },
  },
  list: {
    rowContainer: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      marginLeft: listMargin,
      marginRight: listMargin,
      justifyContent: 'center'
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
    sectionBorder: {
      borderColor: colors.gray5,
      borderWidth: StyleSheet.hairlineWidth,
    },
    sectionHeader: {
      backgroundColor: colors.offWhite,
      flexDirection: 'row'
    },
    sectionHeaderText: {
      color: colors.gray3,
      fontSize: 14,
      marginLeft: listMargin,
      marginTop: 10,
      marginBottom: 10
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
