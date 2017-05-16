import { Dimensions } from 'react-native'
import color from '../../util/colors'
import { sectionHeight, dimensions, border } from '../../util/StyleUtils'

const { width } = Dimensions.get('window')

const styles = {
  button: {
    height: sectionHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: 24, 
    textAlign: 'center', 
    width: Dimensions.get('window').width - 20
  },
  textInput: {
    ...dimensions(width, sectionHeight),
    padding: 10,
    textAlign: 'center'
  },
  balanceContainer: {
    ...border(['bottom'], color.gray5, 1),
    backgroundColor: color.offWhite,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceContainer: {
    flex: 1,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.transparent,
    justifyContent: 'flex-end'
  },
  confirmContainer: {
    flexDirection: 'column', 
    alignItems: 'center', 
    backgroundColor: color.offWhite 
  },
  confirmPayeeContainer: {
    height: sectionHeight, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderBottomColor: color.gray5, 
    borderBottomWidth: 1
  },
  confirmPayeeText: {
    fontSize: 24, 
    color: color.offBlack, 
    textAlign: 'center'
  },
  confirmAmountContainer: {
    height: sectionHeight, 
    flexDirection: 'row', 
    alignItems: 'center'
  }
}

export default styles