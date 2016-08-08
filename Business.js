import React, { Component } from 'react'
import { Navigator } from 'react-native'
import BusinessList from './BusinessList'
import BusinessDetails from './BusinessDetails'

export default class Business extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ id: 'BusinessList' }}
        renderScene={(route, navigator) => {
          if (route.id === 'BusinessList') {
            return <BusinessList businesses={this.props.businesses} navigator={navigator}/>
          } else {
            return <BusinessDetails business={route.business} navigator={navigator}/>
          }
        }}
      />
    )
  }
}
