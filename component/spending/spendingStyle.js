import color from '../../util/colors'
import marginOffset from '../../util/marginOffset'
import commonStyle from '../style'
import { dimensions, margin, border } from '../../util/StyleUtils'
import { baselineDeltaForFonts } from '../DefaultText'

const IMAGE_SIZE = 42
const IMAGE_MARGIN = 14

const styles = {
    separator: {
        ...border(['bottom'], color.gray5, 1),
        marginLeft: IMAGE_SIZE + IMAGE_MARGIN * 2,
        marginRight: 0
    },
    loadingIndicator: {
        flex: 1
    },
    row: {
        container: {
            flexDirection: 'row',
            height: 50,
            paddingRight: 20,
            alignItems: 'center',
            backgroundColor: 'white',
        },
        textContainer: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'flex-end'
        },
        image: {
            ...dimensions(IMAGE_SIZE),
            ...margin(0, IMAGE_MARGIN, 0, IMAGE_MARGIN),
            ...border(['top', 'right', 'bottom', 'left'], color.offWhite, 1),
            borderRadius: 5,
            backgroundColor: color.transparent
        },
        text: {
            fontFamily: commonStyle.font.museo300,
            // the offset required to align this text (18px) with the price (22px)
            marginBottom: baselineDeltaForFonts(22, 18),
            color: color.offBlack,
            fontSize: 18,
            marginRight: 10,
            flex: 1
        },
        price: {
            flex: 0
        },
    },
    noTransactions: {
        container: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 50,
            backgroundColor: color.offWhite
        },
        text: {
            color: color.gray3
        }
    },
    sectionHeader: commonStyle.sectionHeader,
    header: {
        carouselContainer: {
            ...commonStyle.minorShadow,
            backgroundColor: color.white,
            height: marginOffset(106)
        },
        monthlyOption: {
            fontFamily: commonStyle.font.museo500,
            fontSize: 15,
            textAlign: 'center'
        },
        carousel: {
          ...margin(marginOffset(38), 0, 14, 0)
        }
    }
}

export default styles
