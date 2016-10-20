import color from '../../util/colors'
import merge from '../../util/merge'

const borderColor = '#ddd'
const museo700 = 'MuseoSans-700'
const museo500 = 'MuseoSans-300'
const museo300 = 'MuseoSans-300'

const defaultMonthlyOptionText = {
  fontFamily: museo500,
  fontSize: 15,
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
}

const styles = {
  image: {
    width: 44,
    height: 44,
    backgroundColor: color.offWhite,
    borderRadius: 7,
    borderColor: borderColor,
    borderWidth: 1,
    marginVertical: 3,
    flex: 0
  },
  imageVisible: {
    backgroundColor: color.transparent
  },
  rowContainer: {
    flexDirection: 'row',
    height: 50,
    paddingLeft: 14,
    paddingRight: 20
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 14
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
    flexDirection: 'row'
  },
  sectionHeader: {
    fontFamily: museo700,
    fontSize: 14,
    color: color.gray2,
    marginLeft: 14,
    marginBottom: 10,
    alignSelf: 'flex-end'
  },
  separator: {
    marginLeft: 61,
    marginRight: 0,
    borderBottomColor: color.gray5,
    borderBottomWidth: 1
  },
  flex: {
    flex: 1,
  },
  noflex: {
    flex: 0
  },
  center: {
    justifyContent: 'center'
  },
}

//TODO: add shadow to iOS
export const headerStyles = {
  carouselContainer: {
    height: 106,
    backgroundColor: color.white,
    elevation: 5
  },
  monthlyOption: [
    merge(defaultMonthlyOptionText, { color: color.gray }),
    merge(defaultMonthlyOptionText, { color: color.gray2 }),
    merge(defaultMonthlyOptionText, { color: color.gray3 })
  ],
  container: {
    top: 38
  }
}

export const priceStyles = [{
  color: color.bristolBlue,
  size: 32
}, {
  color: color.bristolBlue2,
  size: 32
},{
  color: color.bristolBlue3,
  size: 32
}]

export default styles
