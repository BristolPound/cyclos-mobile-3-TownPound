import { Dimensions } from 'react-native'

export const isScreenSmall = Dimensions.get('window').width < 375

export const screenHeight = Dimensions.get('window').height
