import React from 'react'
import {View, Image} from 'react-native'
import DefaultText from '../DefaultText'
import styles from './ViewFieldsStyle'

/* Expects an array of elements matching
 {
    key: string,
    icon: url,
    text: string
 }
 */

const ViewFields = ({fields}) =>
    <View style={styles.container}>
        {fields.map((field) => (
            field.text ?
                <Field key={field.key} icon={field.icon} text={field.text} />
                : null
        ))}
    </View>

const Field = ({icon, text}) =>
    <View style={styles.field}>
        <Image style={styles.image} source={icon}/>
        <View style={styles.item}>
            <DefaultText style={styles.text}>{text}</DefaultText>
        </View>
    </View>

export default ViewFields