import { StyleSheet } from 'react-native'
import colors from '../../util/colors'

const museo500 = 'MuseoSans-300' // TODO: change to 'MuseoSans-500'
const museo100 = 'MuseoSans-300' // TODO: change to 'MuseoSans-100'

const headerMargin = 24
const listMargin = 14

const styles = {
  flex: {flex: 1},
  rowLayout: {flexDirection: 'row', justifyContent: 'space-between', flex: 1},
  separator: {
    borderBottomColor: colors.gray5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray5,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  dropshadow: {
    shadowColor: colors.gray,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 5 //TODO: check this
  },
  header: {
    backgroundImage: {
      flex: 1,
      position: 'absolute',
      resizeMode: 'cover',
      height: 244
    },
    topSpace: {
      height: 58
    },
    closeIcon: {
      marginLeft: headerMargin,
      marginTop: 40,
      height: 18,
      width: 18
    },
    expandIcon: {
      marginRight: headerMargin,
      marginTop: 40,
      height: 16,
      width: 16
    },
    businessLogo: {
      height: 84,
      width: 84,
      alignSelf: 'center',
      borderColor: colors.bristolBlue,
      borderRadius: 5,
      borderWidth: 2
    },
    title: {
      fontFamily: museo500,
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
  businessDetails: {
    description: {
      marginLeft: headerMargin,
      marginRight: headerMargin,
      marginTop: 18,
      marginBottom: 18
    }
  },
  minorButton: {
    text: {
      fontFamily: museo500,
      alignSelf: 'center',
      color: colors.bristolBlue,
      backgroundColor: colors.transparent,
      fontSize: 14,
      marginTop: 10,
      marginBottom: 10,
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
      fontFamily: museo100,
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
  }
}

export default styles
