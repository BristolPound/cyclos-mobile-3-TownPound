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
    const { container, contents, status, statusSelected, title, verticalStack } = styles.listItem
    const { image, category, display, shortDisplay } = this.props.business
    const statusStyle = merge(status, this.props.isSelected ? statusSelected : {})
    return (
      <View style={container}>
        <View style={statusStyle}/>
        <View style={contents}>
          <ProfileImage img={image} style={styles.listItem.image} category={category} />
          <View style={verticalStack}>
            <DefaultText style={title}>{display}</DefaultText>
            <DefaultText style={styles.listItem.shortDisplay}>{shortDisplay}</DefaultText>
          </View>
        </View>
      </View>
    )
  }
}

export const SelectedBusiness = (props) =>
  <BusinessListItem {...{ ...props, isSelected: true }}/>

export default BusinessListItem
