import color from '../util/colors'

const museo700 = 'MuseoSans-700'
const museo500 = 'MuseoSans-300'
const museo300 = 'MuseoSans-300'
const museo100 = 'MuseoSans-300'

export const dimensions = (value) => ({
  width: value,
  height: value
})

const style = {
  shadow: {
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0
    }
  },
  dropshadow: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7
  },
  font: {
    museo700,
    museo500,
    museo300,
    museo100
  },
  sectionHeader: {
    container: {
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
    text: {
      fontFamily: museo700,
      fontSize: 14,
      color: color.gray2,
      marginLeft: 14
    },
  },
}

export default style
