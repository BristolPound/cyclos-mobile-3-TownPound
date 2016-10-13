import React from 'react'

import HTMLView from 'react-native-htmlview'
import {View, Text, TouchableOpacity} from 'react-native'

import styles from '../profileScreen/ProfileStyle' // Really ought to be a differently named file.
import ViewFields from './ViewFields'

// If expanded, display all items and the description.
// If not expanded, then display only the first two (non-description) items, as well as a link to display any more.
class BusinessDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = { isExpanded: props.isExpanded }
        this.detailsFields = this.getFields(props.business)
        this.summaryFields = this.detailsFields.splice(0,2)
        this.description = props.business.description
    }

    render () {
        return <View>
            <ViewFields fields={this.summaryFields}/>
            {this.renderDetails()}
            {this.renderDescription()}
            {this.renderExpander()}
        </View>
    }

    // if there's a description render it either as html or a view details button.
    // Ironically the details to be displayed is the description, not the business details (address etc.)
    // that are always displayed.
    renderDetails() {
        return (this.state.isExpanded && this.detailsFields.length > 0) ?
            <View>
                <View style={styles.separator}/>
                <ViewFields fields={this.detailsFields}/>
            </View>
            : null
    }

    renderDescription() {
        return (this.state.isExpanded && this.description) ?
            <View>
                <View style={styles.separator}/>
                <View style={styles.businessDetails.description}>
                    <HTMLView value={this.description}/>
                </View>
            </View>
            : null
    }

    renderExpander() {
        return (!this.state.isExpanded && (this.detailsFields.length > 0 || this.description)) ?
            <View>
                <View style={styles.separator}/>
                <TouchableOpacity onPress={() => this.setState({isExpanded: true})}>
                    <View><Text style={styles.minorButton.text}>View Details</Text></View>
                </TouchableOpacity>
            </View>
            : null
    }

    addressToString(address) {
        const addressLines = []
        if (address) {
            if (address.addressLine1) { addressLines.push(address.addressLine1) }
            if (address.addressLine2) { addressLines.push(address.addressLine2) }
            if (address.zip) { addressLines.push(address.zip) }
        }
        return addressLines.join(', ')
    }

    getFields(business) {
        const fields = []

        // opening hours and phone are the priorities
        if (business.openingTimes) {
            fields.push({
                key: 'openingField',
                icon: require('./Opening times.png'),
                text: business.businessopeningtimes // TODO: FIND THIS!
            })
        }
        if (business.businessphone) {
            fields.push({
                key: 'phoneField',
                icon: require('./Phone.png'),
                text: business.businessphone
            })
        }
        if (business.address) {
            fields.push({
                key: 'addressField',
                icon: require('./Address.png'),
                text: this.addressToString(business.address)
            })
        }
        if (business.businessemail) {
            fields.push({
                key: 'emailField',
                icon: require('./Email.png'),
                text: business.businessemail
            })
        }
        return fields
    }
}

export default BusinessDetails