import color from '../util/colors'

const style = {
  shadow: {
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0
    }
  },
  dropshadow: {
    shadowColor: color.gray2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.26,
    shadowRadius: 4,
    backgroundColor: color.white,
    elevation: 5 //TODO: check this
  },
  font: {
    museo700: 'MuseoSans-700',
    museo500: 'MuseoSans-300',
    museo300: 'MuseoSans-300',
    museo100: 'MuseoSans-300'
  }
}

export default style
