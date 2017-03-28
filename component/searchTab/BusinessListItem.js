import React from 'react'
import { View } from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import styles from './BusinessListStyle'
import merge from '../../util/merge'
import { SEARCH_BAR_HEIGHT } from './SearchTabStyle'
import { CloseButton } from '../common/CloseButton'
import { getBusinessImage } from '../../util/business'

const CLOSE_BUTTON = require('../common/assets/Close.png')

class BusinessListItem extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.business.colorCode !== this.props.business.colorCode
  }

  setNativeProps() {
    this.refs.businessListItem.setNativeProps(this.props)
  }

  render() {
    const { container, contents, status, statusSelected, title, verticalStack, closeButton } = styles.listItem
    const { colorCode } = this.props.business
    const { businesscategory, username } = this.props.business.fields
    const statusStyle = merge(status, this.props.isSelected ? statusSelected : {})

    var image = getBusinessImage(this.props.business)

    return (
      <View style={container} ref="businessListItem">
          <View style={statusStyle}/>
          <View style={contents}>
              <ProfileImage image={image ? {uri: image} : undefined} style={styles.listItem.image} category={'shop'} borderColor='offWhite' colorCode={colorCode}/>
              <View style={verticalStack}>
                  <DefaultText style={title}>{this.props.business.name}</DefaultText>
                  <DefaultText style={styles.listItem.shortDisplay}>{username.value}</DefaultText>
              </View>
          </View>
          {this.props.isSelected && <CloseButton onPress={this.props.deselect} closeButtonType={CLOSE_BUTTON} style={closeButton} size={SEARCH_BAR_HEIGHT+10}/>
          }
      </View>
    )
  }
}


export const SelectedBusiness = (props) => {
  return <BusinessListItem {...{ ...props, isSelected: true }}/>
}


export default BusinessListItem
