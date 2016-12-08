import { Dimensions } from 'react-native'
import marginOffset from './marginOffset'

export const isScreenSmall = Dimensions.get('window').height < 600

export const screenHeight = marginOffset(Dimensions.get('window').height)
