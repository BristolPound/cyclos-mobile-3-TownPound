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
    <View>
        {fields.map((field) => (
            // 'key' is magic so isn't passed down into the method.
            // Hence define a duplicate accessibilityLabel.
            field.text ?
                <Field key={field.key} icon={field.icon} text={field.text} accessibilityLabel={field.key}/>
                : null
        ))}
    </View>

const Field = ({icon, text, accessibilityLabel}) =>
    <View style={styles.field}>
        <Image style={styles.image} source={icon}/>
        <View style={styles.item} accessibilityLabel={accessibilityLabel}>
            <DefaultText style={styles.text}>{text}</DefaultText>
        </View>
    </View>

export default ViewFields
