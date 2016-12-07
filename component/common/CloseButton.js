import React from 'react'
import { Image, TouchableHighlight } from 'react-native'

import color from '../../util/colors'
import merge from '../../util/merge'
import { dimensions, margin } from '../../util/StyleUtils'
import { headerMargin } from '../profileScreen/ProfileStyle'

const closeButtonStyle = {
    closeButton: {
        ...margin(40, 0, 0, headerMargin),
        position: 'absolute',
        zIndex: 100,
        flex: 1,
    },
    closeIcon: {
        ...dimensions(18),
        ...margin(10),
        marginLeft: 0
    }
}

export const CloseButton = props => {
    const { closeButton, closeIcon } = closeButtonStyle
    const { onPress, closeButtonType, style } = props

    return (
        <TouchableHighlight style={merge(closeButton, style)} onPress={onPress} underlayColor={color.transparent}>
            <Image style={closeIcon} source={closeButtonType} />
        </TouchableHighlight>
    )
}