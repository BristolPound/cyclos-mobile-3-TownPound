import React from 'react'
import { TouchableHighlight } from 'react-native'
import BusinessListItem from './BusinessListItem'

export default class BusinessListHighlight extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
          <TouchableHighlight onPress={() => this.props.onPress(this.props.business.id)}>
              <BusinessListItem business={this.props.business} key={this.props.business.id} />
          </TouchableHighlight>
    )
  }
}