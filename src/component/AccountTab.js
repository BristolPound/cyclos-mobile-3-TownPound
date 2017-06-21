import React from 'react'
import { connect } from 'react-redux'
import { accountSections } from '../store/reducer/account'
import Account from './account/Account'
import ContactList from './account/ContactList'

const AccountTab = (props) => {
    switch (props.accountSection) {
            case accountSections.me:
                return <Account />
            case accountSections.contactList:
                return <ContactList />
        }
}

const mapStateToProps = state => ({accountSection: state.account.accountSection})

export default connect(mapStateToProps, null)(AccountTab)
