import {Dimensions} from 'react-native'

const isSmall = () => Dimensions.get('window').height < 600

export default {isSmall: isSmall}
