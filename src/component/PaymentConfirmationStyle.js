import colors from '../util/colors'
import commonStyle from './style'
import { Dimensions } from 'react-native'
import { baselineDeltaForFonts } from './DefaultText'
import { border, sectionHeight } from '../util/StyleUtils'
import { isScreenSmall } from '../util/ScreenSizes'

const style = {
  container: {
		justifyContent: 'space-between',
		height: Dimensions.get('window').height - sectionHeight
  },
	innerContainer: {
		justifyContent: 'space-between'
  },
	buttonContainer: {
      height: sectionHeight,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bristolBlue
	},
	buttonInnerContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: 'transparent'
	},
	buttonText: {
		fontSize: 24,
		color: 'white',
		textAlign: 'center',
		width: Dimensions.get('window').width - 20
	},
	priceContainer: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	pricePoundLogo: {
			height: 43,
			width: 38.1,
			marginBottom: baselineDeltaForFonts(80, 58)
	},
	pricePoundLogoContainer: {
			alignSelf: 'flex-end',
			marginRight: 12,
			marginBottom: 11
	},
	priceBeforeDecimal: {
			fontFamily: commonStyle.font.museo500,
			fontSize: 80,
			alignSelf: 'flex-end',
			margin: 0,
			padding: 0,
			color: colors.bristolBlue
	},
	priceAfterDecimal: {
			fontFamily: commonStyle.font.museo300,
			fontSize: 58,
			color: colors.bristolBlue,
			alignSelf: 'flex-end',
			marginBottom: baselineDeltaForFonts(80, 58),
			paddingBottom: 0,
			opacity: 0.6
	},
	separator: {
      ...border(['bottom'], colors.gray5, 1),
      marginHorizontal: 24
  },
	detailsInnerContainer: {
		marginVertical: isScreenSmall ? 12 : 18
	},
	referenceContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: isScreenSmall ? 43 : 61,
		marginHorizontal: isScreenSmall ? 20 : 24,
		marginVertical: 2
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: isScreenSmall ? 20 : 24,
		marginVertical: 2
	},
	rowTitle: {
		fontFamily: commonStyle.font.museo300,
		color: colors.gray,
		fontSize: isScreenSmall ? 19 : 22
	},
	rowData: {
		fontFamily: commonStyle.font.museo300,
		color: colors.offBlack,
		fontSize: isScreenSmall ? 19 : 22
	},
	sectionHeader: commonStyle.sectionHeader
}

export default style
