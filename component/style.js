import color from '../util/colors'

const museo700 = 'MuseoSans-700'
const museo500 = 'MuseoSans-300' // to be changed when font is available
const museo300 = 'MuseoSans-300'
const museo100 = 'MuseoSans-300' // to be changed when font is available

export const dimensions = (value) => ({
  width: value,
  height: value
})

const layoutDimensions = (top, right = top, bottom = top, left = right, property) => {
    let styles = {}
    styles[`${property}Top`] = top
    styles[`${property}Right`] = right
    styles[`${property}Bottom`] = bottom
    styles[`${property}Left`] = left
    return styles
}

export const margin = (top, right, bottom, left) =>
    layoutDimensions(top, right, bottom, left, 'margin')

export const padding = (top, right, bottom, left) =>
    layoutDimensions(top, right, bottom, left, 'padding')

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
      borderBottomColor: color.gray5,
      borderBottomWidth: 1,
      borderTopColor: color.gray5,
      borderTopWidth: 1,
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
