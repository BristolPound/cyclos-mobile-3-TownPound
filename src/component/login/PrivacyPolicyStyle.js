import { StyleSheet } from 'react-native'
import Colors from '@Colors/colors'
import { border, absolutePosition } from '../../util/StyleUtils'

const style = {
  wrapper: {
    ...absolutePosition(),
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    backgroundColor: Colors.primaryBlue,
    flexDirection: 'row',
    justifyContent: 'center'
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
    // padding: 5,
    elevation: 5,
    shadowOffset:{width: 5, height: 5},
    shadowColor: Colors.offBlack,
    shadowOpacity: 0.5
  },
  instructionText: {
      fontSize: 16,
      color: Colors.gray,
      padding: 10,
      textAlign: 'center',
      marginBottom: 7
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
