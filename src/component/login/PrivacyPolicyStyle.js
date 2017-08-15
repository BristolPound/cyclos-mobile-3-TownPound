import { StyleSheet, Dimensions } from 'react-native'
import Colors from '@Colors/colors'
import { border, absolutePosition } from '../../util/StyleUtils'
import { screenWidth, screenHeight } from '../../util/ScreenSizes'

const style = {
  wrapper: {
    ...absolutePosition(),
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  separator: {
    ...border(['bottom', 'top'], Colors.gray, StyleSheet.hairlineWidth)
  },
  header: {
    backgroundColor: Colors.primaryBlue,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  headerText: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    fontSize: 20
  },
  container: {
    backgroundColor: Colors.offWhite,
    marginBottom: 100,
    width: screenWidth * 0.9,
    height: screenHeight * 0.5,
    elevation: 5,
    shadowOffset:{width: 5, height: 5},
    shadowColor: Colors.offBlack,
    shadowOpacity: 0.5
  },
  instructionWrapper: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  instructionText: {
    div: {
      textAlign: 'center'
    },
    p: {
      fontSize: 14,
      color: Colors.gray
    }
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 7
  },
  buttonContainer: {
    height: 40,
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 5,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white'
  }

}

export default style
