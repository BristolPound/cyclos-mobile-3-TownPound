import { StyleSheet } from 'react-native'
import { dimensions, margin, border, padding } from '../../util/StyleUtils'
import commonStyle from '../style'
import colors from '../../util/colors'

const styles = {
  description: {
    flex: 1,
    ...margin(18, 24, 0, 24)
  },
  separator: {
    ...border(['bottom', 'top'], colors.gray5, StyleSheet.hairlineWidth)
  },
  field: {
    ...margin(18, 24, 0, 24),
    flexDirection: 'row',
    paddingTop: 1,
    backgroundColor: colors.transparent,
  },
  image: {
    ...dimensions(18, 20),
    marginRight: 16
  },
  item: {
    flexDirection: 'column'
  },
  text: {
    fontSize: 16,
    color: colors.gray,
    flexWrap: 'wrap'
  },
  minorButtonText: {
    fontFamily: commonStyle.font.museo500,
    alignSelf: 'center',
    color: colors.bristolBlue,
    backgroundColor: colors.transparent,
    fontSize: 14,
    marginTop: 18,
    paddingBottom: 8
  },
  addressOnly: {
    ...padding(18, 0, 30, 0)
  },
  moreDetails: {
    paddingBottom: 12
  }
}

export default styles
