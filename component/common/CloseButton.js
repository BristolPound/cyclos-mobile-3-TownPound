import React from 'react'
import { Image, TouchableHighlight } from 'react-native'

import color from '../../util/colors'
import merge from '../../util/merge'
import { dimensions, margin } from '../../util/StyleUtils'

const style = {
  closeIcon: {
    ...dimensions(18),
  }
}

export const CloseButton = props => {
    return (
        <TouchableHighlight style={merge(dimensions(props.size), props.style)} onPress={props.onPress} underlayColor={color.transparent}>
            <Image style={merge(style.closeIcon, margin((props.size - 18) / 2))} source={props.closeButtonType} />
        </TouchableHighlight>
    )
}
