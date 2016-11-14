import React from 'react'
import {View} from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import styles from './BusinessListStyle'
import merge from '../../util/merge'

class BusinessListItem extends React.Component {

  shouldComponentUpdate() {
    return false
  }

  render() {
    const statusStyle = merge(styles.listItem.status,
      this.props.isSelected ? styles.listItem.statusSelected : {}
    )
    return (
      <View
        style={styles.listItem.container}>
        <View
          style={statusStyle}/>
        <View style={styles.listItem.contents}>
          <ProfileImage
            img={this.props.business.image}
            style={styles.listItem.image}
            category={this.props.business.category}/>
          <View style={styles.listItem.verticalStack}>
            <DefaultText style={styles.listItem.title}>
              {this.props.business.display}
            </DefaultText>
            <DefaultText style={styles.listItem.shortDisplay}>
              {this.props.business.shortDisplay}
            </DefaultText>
          </View>
        </View>
      </View>
    )
  }
}

export const SelectedBusiness = (props) =>
  <BusinessListItem {...{ ...props, isSelected: true }}/>

export default BusinessListItem
