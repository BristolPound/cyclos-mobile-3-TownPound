import React from 'react'
import FixedScrollableList from '../searchTab/FixedScrollableList'
import { View, Text } from 'react-native'
import { dimensions, padding, border, margin } from '../../util/StyleUtils'
import { isScreenSmall } from '../../util/ScreenSizes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import Colors from '@Colors/colors'

export const ROW_HEIGHT = isScreenSmall ? 50 : 60
const CONTENT_PADDING = isScreenSmall ? 4 : 8

const styles = {
    container: {
      ...border(['top'], Colors.offWhite, 1),
      flexDirection: 'row',
      height: ROW_HEIGHT,
      backgroundColor: Colors.transparent
    },
    contents: {
      ...padding(CONTENT_PADDING, 0, CONTENT_PADDING, 5),
      flex: 1,
      flexDirection: 'row',
    },
    image: {
      ...dimensions(isScreenSmall ? 42 : 44),
      paddingRight: 5,
      borderRadius: 5,
    },
    verticalStack: {
      ...padding(0, 10, 0, 10),
      flex: 1,
      flexDirection: 'column'
    },
    title: {
      fontSize: isScreenSmall ? 16 : 18,
      marginTop: 2
    },
    shortDisplay: {
      fontSize: 14,
      color: Colors.gray3,
      marginBottom: 6
    },
    status: {
      width: 5,
    }
}

const ComponentForItem = (item) => {
    return (
    <View style={styles.container} ref="contactListItem">
        <View style={styles.status}/>
        <View style={styles.contents}>
            <ProfileImage image={item.image ? {uri: item.image.url} : undefined} style={styles.image} category={'person'} borderColor='offWhite'/>
            <View style={styles.verticalStack}>
                <DefaultText style={styles.title}>{item.name}</DefaultText>
                <DefaultText style={styles.shortDisplay}>{item.username}</DefaultText>
            </View>
        </View>
    </View>
    )
}

class ContactList extends React.Component {
    render() {
        return (
            <View style={{margin: 20, marginTop: 40}}>
                <FixedScrollableList
                    items={this.props.contactList}
                    componentForItem={ComponentForItem}
                    onPress={(item) => {}}/>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
  contactList: state.account.contactList,
  accountState: state.account
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ContactList)
