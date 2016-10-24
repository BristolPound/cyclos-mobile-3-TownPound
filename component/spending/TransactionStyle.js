import color from '../../util/colors'

const museo700 = 'MuseoSans-700'
const museo500 = 'MuseoSans-300'
const museo300 = 'MuseoSans-300'

const styles = {
  image: {
    width: 42,
    height: 42,
    marginLeft: 14,
    marginRight: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.offWhite,
    backgroundColor: color.transparent
  },
  rowContainer: {
    flexDirection: 'row',
    height: 50,
    paddingRight: 20,
    alignItems: 'center'
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end'
  },
  text: {
    fontFamily: museo300,
    color: color.offBlack,
    fontSize: 18,
    marginRight: 10
  },
  headerContainer: {
    borderBottomColor: color.gray5,
    borderBottomWidth: 1,
    borderTopColor: color.gray5,
    borderTopWidth: 1,
    height: 34,
    backgroundColor: color.offWhite,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  sectionHeader: {
    fontFamily: museo700,
    fontSize: 14,
    color: color.gray2,
    marginLeft: 14
  },
  separator: {
    marginLeft: 61,
    marginRight: 0,
    borderBottomColor: color.gray5,
    borderBottomWidth: 1
  },
  noflex: {
    flex: 0
  },
  center: {
    justifyContent: 'center'
  },
  noTransactions: {
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 50,
      backgroundColor: color.offWhite
    },
    text: {
      color: color.gray3
    }
  },
  headerStyle: {
    carouselContainer: {
      height: 106,
      backgroundColor: color.white,
      elevation: 5
    },
    monthlyOption: {
      fontFamily: museo500,
      fontSize: 15,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      color: color.gray
    },
    priceStyle: {
      color: color.bristolBlue,
      size: 32
    }
  }
}


export default styles
