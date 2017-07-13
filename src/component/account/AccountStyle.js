import { StyleSheet } from 'react-native'
import { baselineDeltaForFonts } from '../DefaultText'
import Colors from '@Colors/colors'
import commonStyle from '../style'
import { isScreenSmall } from '../../util/ScreenSizes'

const styles = {
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  container: {
    flex: 1
  },
  detailsList: {
    backgroundColor: Colors.offWhite
  },
  sectionHeader: commonStyle.sectionHeader,
  version: {
    textAlign: 'center', 
    backgroundColor: Colors.offWhite, 
    color: Colors.gray2,
    alignItems: 'flex-end',
    paddingBottom: 5
  },
  row: {
    container: {
      height: isScreenSmall ? 40 : 42,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 14,
      paddingRight: 14,
      backgroundColor: Colors.white
    },
    label: {
      fontSize: 16,
      color: Colors.offBlack,
      fontFamily: commonStyle.font.museo500,
      flex: 1
    },
    secondary: {
      flex: 0,
      // the delta required to align this with the label (which has a larger font size)
      marginBottom: baselineDeltaForFonts(16, 14),
      fontSize: 14,
      color: Colors.gray2,
      fontFamily: commonStyle.font.museo300
    }
  },
  separator: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  }
}

export default styles
