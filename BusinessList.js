import React, { Component } from 'react'
import { ActivityIndicator, ListView, View, TextInput } from 'react-native'
import BusinessListItem from './BusinessListItem'
import {getBusinesses} from './api'
import color from './colors'

class BusinessList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.userName !== r2.userName
    })

    getBusinesses()
      .then(businesses => {
          this.setState({
              loading: false,
              dataSource: this.ds.cloneWithRows(businesses),
              businesses
          })
      })
      .catch(console.error)

  }

  _navigateToBusiness(business) {
    this.props.navigator.push({
      id: 'BusinessDetails',
      business
    })
  }

  _renderRow(business) {
    return <BusinessListItem business={business} businessClicked={this._navigateToBusiness.bind(this)}/>
  }

  _filterList(text) {
    const contains = (a, b) =>
      a.toLowerCase().indexOf(b.toLowerCase()) !== -1

    const filtered = this.state.businesses.filter(b => contains(b.name, text))

    this.setState({
      dataSource: this.ds.cloneWithRows(filtered)
    })
  }

  render() {
    return this.state.loading
      ? <ActivityIndicator size='large' style={{flex: 1}}/>
      : (
        <View style={{flex: 1}}>
          <View style={{backgroundColor: color.bristolBlue}}>
            <TextInput placeholder='search'
              style={{height: 30, margin: 10, backgroundColor: 'white', padding: 2}}
              onChangeText={this._filterList.bind(this)}/>
          </View>
          <ListView
            style={{flex: 1}}
            pageSize={10}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}/>
        </View>
      )
  }
}

export default BusinessList
