import colors from '../util/colors'
import commonStyle from './style'

const style = {
	background: {
		flex: 1,
		backgroundColor: colors.bristolBlue,
		justifyContent: 'center',
		alignItems: 'center'
	},
    title: {
		fontFamily: commonStyle.font.museo500,
		marginTop: 8,
		fontSize: 20,
		color: colors.offBlack
    },
	subtitle: {
		marginBottom: 46,
		fontSize: 18,
		color: colors.gray
    },
	time: {
		fontFamily: commonStyle.font.museo100,
		color: colors.gray
    }
}

export default style
