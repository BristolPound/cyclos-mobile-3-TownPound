import { dimensions, padding, border } from '../../util/StyleUtils'
import { isScreenSmall } from '../../util/ScreenSizes'
import Colors from '@Colors/colors'
import { TAB_BAR_HEIGHT } from '../tabbar/TabBarStyle'

export const ROW_HEIGHT = 52
const CONTENT_PADDING = 14

const styles = {
    contactList: {
        container: {
            paddingTop: 40, 
            flex: 1
        },
        separator: {
            ...border(['bottom'], Colors.primaryBlue, 1),
            marginLeft: 0,
            marginRight: 0,
            marginTop: 4,
            marginBottom: 4
        }, 
        list: {
            flex: 1
        }
    },
    contact: {
        container: {
            ...border(['bottom'], Colors.offWhite, 1),
            flexDirection: 'row',
            height: ROW_HEIGHT,
            backgroundColor: Colors.transparent,
            ...padding(4, 14)
        },
        image: {
            ...dimensions(isScreenSmall ? 42 : 44),
            paddingRight: 5,
            borderRadius: 5,
        },
        verticalStack: {
            ...padding(0, 10, 0, 10),
            flex: 1,
            flexDirection: 'column'
        },
        title: {
            fontSize: isScreenSmall ? 16 : 18,
            marginTop: 2
        },
        shortDisplay: {
            fontSize: 14,
            color: Colors.gray3,
            marginBottom: 6
        }
    },
}

export default styles