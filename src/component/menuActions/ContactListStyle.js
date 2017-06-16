import { dimensions, padding, border } from '../../util/StyleUtils'
import { isScreenSmall } from '../../util/ScreenSizes'
import Colors from '@Colors/colors'
import { TAB_BAR_HEIGHT } from '../tabbar/TabBarStyle'

export const ROW_HEIGHT = isScreenSmall ? 50 : 60
const CONTENT_PADDING = isScreenSmall ? 4 : 8

const styles = {
    contactList: {
        container: {
            padding: 20, 
            paddingTop: 40, 
            flex: 1
        },
        separator: {
            ...border(['bottom'], Colors.gray5, 1),
            marginLeft: 0,
            marginRight: 0,
            marginTop: 10,
            marginBottom: 10
        }, 
        list: {
            bottom: 0, 
            flex: 1
        },
        activityIndicatorContainer: {
            alignContent: 'center', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1
        }
    },
    contact: {
        container: {
            ...border(['top'], Colors.offWhite, 1),
            flexDirection: 'row',
            height: ROW_HEIGHT,
            backgroundColor: Colors.transparent
        },
        contents: {
            ...padding(CONTENT_PADDING, 0, CONTENT_PADDING, 5),
            flex: 1,
            flexDirection: 'row',
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
        },
        status: {
            width: 5,
        }
    },
}

export default styles
