import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ListView,
  View
} from 'react-native';

import BusinessListItem from './BusinessListItem';

class BusinessList extends Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.userName !== r2.userName
    });
    this.state = {
      dataSource: ds.cloneWithRows(props.businesses)
    };
  }

  _renderRow(business) {
    return <BusinessListItem business={business}/>;
  }

  render() {
    return (
      <ListView
        pageSize={10}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}/>
    );
  }
}

export default BusinessList;
