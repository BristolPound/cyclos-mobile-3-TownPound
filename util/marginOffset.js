import PLATFORM from './Platforms'
import {StatusBar} from 'react-native'

const marginOffset = (val) =>
  PLATFORM.isAndroid() ? val - StatusBar.currentHeight : val

export default marginOffset
