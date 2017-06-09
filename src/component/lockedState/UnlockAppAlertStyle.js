import React from'React'
import { StyleSheet } from 'react-native'
import { border } from '../../util/StyleUtils'
import Colors from '@Colors/colors'

const style = {
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: Colors.offWhite,
        marginBottom: 100,
        padding: 5,
        width: 300,
        borderRadius: 5,
        elevation: 5,
        shadowOffset:{width: 5, height: 5},
        shadowColor: Colors.offBlack,
        shadowOpacity: 0.5,
    },
    instructionText: {
        fontSize: 16,
        color: Colors.gray,
        padding: 10,
        textAlign: 'center',
        marginBottom: 7
    },
    errorText: {
        fontSize: 13,
        color: Colors.red,
        padding: 10,
        textAlign: 'center'
    },
    form: { 
        ...border(['bottom', 'top'],
        Colors.gray5,
        StyleSheet.hairlineWidth)
    },
    input: {
        height: 50,
        fontSize: 16,
        padding: 10,
        textAlign: 'center',
        margin: 7
    },
    buttonContainer: {
        height: 56,
        padding: 20,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center'
    }
}

export default style
