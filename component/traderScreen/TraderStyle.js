import { StyleSheet } from 'react-native'
import colors from '../../util/colors'

const museo500 = 'MuseoSans-300'// TODO: change to 'MuseoSans-500'
const museo100 = 'MuseoSans-300'// TODO: change to 'MuseoSans-100'

const headerMargin = 24
const listMargin = 14

const styles = {
  flex: {flex: 1},
  rowLayout: {flexDirection: 'row', justifyContent: 'space-between', flex: 1},
  separator: {
    borderBottomColor: colors.grey5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grey5,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  dropshadow: {
    shadowColor: colors.grey,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 5 //TODO: check this
  },
  header: {
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
    businessNoLogo: {
      height: 84,
      width: 84,
      alignSelf: 'center'
    },
    title: {
      fontFamily: museo500,
      alignSelf: 'center',
      marginTop: 8,
      fontSize: 20,
      color: colors.offBlack
    },
    subtitle: {
      alignSelf: 'center',
      marginBottom: 46,
      fontSize: 18,
      color: colors.grey
    },
  },
  businessDetails: {
    description: {
      marginLeft: headerMargin,
      marginRight: headerMargin,
      marginTop: 18,
      marginBottom:0
    }
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
      color: colors.grey
    },
    price: {
      flex: 1,
      width: 90,
      alignSelf: 'center'
    },
    sectionBorder: {
      borderColor: colors.grey5,
      borderWidth: StyleSheet.hairlineWidth,
    },
    sectionHeader: {
      backgroundColor: colors.offWhite,
      flexDirection: 'row'
    },
    sectionHeaderText: {
      color: colors.grey3,
      fontSize: 14,
      marginLeft: listMargin,
      marginTop: 10,
      marginBottom: 10
    },
    separator: {
      marginLeft: listMargin,
      borderColor: colors.grey5,
      borderWidth: StyleSheet.hairlineWidth
    }
  },
  footer: {
    borderTopColor: colors.grey5,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.offWhite,
    flex: 1,
    flexDirection: 'column-reverse'
  }
}

export default styles
