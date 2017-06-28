import { Dimensions } from 'react-native'
import Colors from '@Colors/colors'
import { sectionHeight, dimensions, border } from '../../util/StyleUtils'

const { width } = Dimensions.get('window')

const DROPDOWN_LINE_HEIGHT = 30

const styles = {
  button: {
    height: sectionHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
    width: Dimensions.get('window').width - 20
  },
  noInternetMessage: {
    fontSize: 14,
    textAlign: 'center',
    width: Dimensions.get('window').width - 20,
    fontStyle: 'italic',
    color: 'red'
  },
  textInput: {
    ...dimensions(width, sectionHeight),
    padding: 10,
    textAlign: 'center'
  },
  autocompleteContainer: {
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1
  },
  autocompleteFixer: {
    ...dimensions(width, sectionHeight + DROPDOWN_LINE_HEIGHT),
    padding: 10
  },
  balanceContainer: {
    ...border(['bottom'], Colors.gray5, 1),
    backgroundColor: Colors.offWhite,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceContainer: {
    flex: 1,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
    justifyContent: 'flex-end'
  },
  confirmContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.offWhite
  },
  confirmPayeeContainer: {
    height: sectionHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1
  },
  confirmDescriptionContainer: {
    height: sectionHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    marginLeft: 15,
    marginRight: 15
  },
  confirmPayeeText: {
    fontSize: 24,
    color: Colors.offBlack,
    textAlign: 'center'
  },
  confirmDescriptionText: {
    fontSize: 24,
    color: Colors.offBlack,
    textAlign: 'center'
  },
  confirmAmountContainer: {
    height: sectionHeight,
    flexDirection: 'row',
    alignItems: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray5
  },
  dropdownContainer: {
    borderWidth: 0,
    ...dimensions(width, DROPDOWN_LINE_HEIGHT),
  },
  dropdownItem: {
    paddingLeft: 15,
    paddingRight: 15,
    lineHeight: DROPDOWN_LINE_HEIGHT,
    textAlign: 'center'
  }
}

export default styles
