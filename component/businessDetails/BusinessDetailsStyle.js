import { StyleSheet } from 'react-native'
import { dimensions, margin, border } from '../../util/StyleUtils'
import colors from '../../util/colors'

const styles = {
  description: {
    ...margin(18, 24, 0, 24)
  },
  separator: {
    ...border(['bottom', 'top'], colors.gray5, StyleSheet.hairlineWidth)
  },
  field: {
    ...margin(18, 24, 0, 24),
    flexDirection: 'row',
    paddingTop: 1,
    backgroundColor: colors.white,
  },
  image: {
    ...dimensions(18, 20),
    marginRight: 16
  },
  item: {
    flexDirection: 'column',
    flex: 1
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: colors.gray,
    flexWrap: 'wrap'
  },
}

export default styles
