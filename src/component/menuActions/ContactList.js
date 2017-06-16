import React from 'react'
import FixedScrollableList from '../searchTab/FixedScrollableList'
import { View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import animateTo from '../../util/animateTo'
import styles from './ContactListStyle'

const modalSlideTime = 300

const componentForItem = (item) => 
    <View style={styles.contact.container} ref="contactListItem">
        <View style={styles.contact.status}/>
        <View style={styles.contact.contents}>
            <ProfileImage image={item.image ? {uri: item.image.url} : undefined} style={styles.contact.image} category={'person'} borderColor='offWhite'/>
            <View style={styles.contact.verticalStack}>
                <DefaultText style={styles.contact.title}>{item.name}</DefaultText>
                <DefaultText style={styles.contact.shortDisplay}>{item.username}</DefaultText>
            </View>
        </View>
    </View>

class ContactList extends React.Component {
    constructor() {
        super()
        this.state = { visible: false }
    }

    componentDidMount() {
        setTimeout(()=>{
            this.setState({visible: true})
        }, 280)
    }

    componentWillUnmount() {
        this.setState({visible: false})
    }

    render() {
        return (
            <View style={styles.contactList.container}>
                <DefaultText>
                    Contact List
                </DefaultText>
                <View style={styles.contactList.separator}/>
                { this.state.visible 
                    ?   <FixedScrollableList
                            items={this.props.contactList}
                            componentForItem={componentForItem}
                            onPress={(item) => {}}
                            style={styles.contactList.list}/>
                    :   <View style={styles.contactList.activityIndicatorContainer}> 
                            <ActivityIndicator /> 
                        </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    contactList: state.account.contactList
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ContactList)
