import color from '../util/colors'
import { dimensions, border } from '../util/StyleUtils'

const museo700 = 'MuseoSans-700'
const museo500 = 'MuseoSans-300' // to be changed when font is available
const museo300 = 'MuseoSans-300'
const museo100 = 'MuseoSans-300' // to be changed when font is available

const style = {
  shadow: {
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      ...dimensions(0)
    },
    elevation: 10,
  },
  font: {
    museo700,
    museo500,
    museo300,
    museo100
  },
  sectionHeader: {
    container: {
      ...border(['bottom', 'top'], color.gray5, 1),
      height: 34,
      backgroundColor: color.offWhite,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontFamily: museo700,
      fontSize: 14,
      color: color.gray3,
      marginLeft: 14
    },
  },
}

export default style
