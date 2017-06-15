import React from 'react'
import { View } from 'react-native'
import DefaultText from '../DefaultText'
import { border } from '../../util/StyleUtils'
import Colors from '@Colors/colors'

const styles = {
    separator: {
        ...border(['bottom'], Colors.gray5, 1),
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10,
        marginBottom: 10
    }
}


class Feedback extends React.Component {
    render() {
        return (
            <View style={{margin: 20, marginTop: 40}}>
                <DefaultText>
                    Feedback
                </DefaultText>
                <View style={styles.separator}/>
            </View>
        )
    }
}

export default Feedback
