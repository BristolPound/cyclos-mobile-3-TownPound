import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native'

import colors from '../../util/colors'

const overlayStyle =  {
    visible: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        opacity: 0.5
    },
    hidden: {
        position: 'absolute',
        height: 0
    }
}

export const Overlay = props =>
    <TouchableHighlight
        style={props.overlayVisible ? overlayStyle.visible : overlayStyle.hidden}
        onPress={props.onPress}
        underlayColor={colors.transparent}>
        <View/>
    </TouchableHighlight>