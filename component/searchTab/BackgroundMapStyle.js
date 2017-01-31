import { horizontalAbsolutePosition } from '../../util/StyleUtils'
import { Dimensions } from 'react-native'

const style = {
  mapContainer: {
    ...horizontalAbsolutePosition(0, 0),
    top: -80,
    height: Dimensions.get('window').height + 120,
  },
  map: {
    ...horizontalAbsolutePosition(0, 0),
    top: 0,
    bottom: 0,
  },
  loadingOverlay: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white'
  },
  warningContainer: {
    backgroundColor: 'red',
    height: 320,
    ...horizontalAbsolutePosition(0, 0),
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    top: 0
  }
}

export default style
