import React from 'react'
import FixedScrollableList from '../searchTab/FixedScrollableList'
import { View, TouchableHighlight, Image } from 'react-native'
import { switchSection, accountSections } from '../../store/reducer/account'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Colors from '@Colors/colors'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import Images from '@Assets/images'
import styles from './ContactListStyle'
import { openDetailsModal } from '../../store/reducer/navigation'

const componentForItem = (item) => 
    <View style={styles.contact.container} ref="contactListItem">
            <ProfileImage image={item.image ? {uri: item.image.url} : undefined} style={styles.contact.image} category={'person'} borderColor='offWhite'/>
            <View style={styles.contact.verticalStack}>
                <DefaultText style={styles.contact.title}>{item.name}</DefaultText>
                <DefaultText style={styles.contact.shortDisplay}>{item.username}</DefaultText>
            </View>
    </View>

const Button = ({onPress, buttonText, icon }) => 
    <TouchableHighlight 
        onPress={onPress}
        underlayColor={onPress ? Colors.gray5 : Colors.transparent}> 
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            { icon && <Image source={icon} style={{height: 18, width: 18, marginRight: 4, transform: [{rotate: '90deg'}]}}/> }
            <DefaultText style={{color: Colors.primaryBlue}}>{buttonText}</DefaultText>
        </View>
    </TouchableHighlight>

const ContactListHeader = ({ switchSection }) => 
    <View style={{ marginRight: 14, marginLeft: 14, flexDirection: 'row', justifyContent: 'space-between', height: 32 }}> 
        <Button onPress={() => switchSection(accountSections.me)} buttonText={'Me'} icon={Images.expandTab} />
        <DefaultText> Contact List </DefaultText>
        <Button onPress={() => {}} buttonText={'Edit'} />
    </View>

class ContactList extends React.Component {
    render() {
        const { openDetailsModal, contactList, switchSection } = this.props
        return (
            <View style={styles.contactList.container}>
                <ContactListHeader switchSection={switchSection} />
                <View style={styles.contactList.separator}/>
                <FixedScrollableList
                        items={contactList}
                        componentForItem={componentForItem}
                        onPress={(item) => openDetailsModal(item)}
                        style={styles.contactList.list}/>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    contactList: state.account.contactList
})

const mapDispatchToProps = (dispatch) => 
    bindActionCreators({ openDetailsModal, switchSection }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ContactList)