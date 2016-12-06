import {Dimensions} from 'react-native'
import marginOffset from './marginOffset'

const isSmall = () => Dimensions.get('window').height < 600

export const screenHeight = marginOffset(Dimensions.get('window').height)

export default {isSmall: isSmall}
