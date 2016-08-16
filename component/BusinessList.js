import React from 'react'
import { ActivityIndicator, ListView, View } from 'react-native'
import { connect } from 'react-redux'
import BusinessListItem from './BusinessListItem'

const renderRow = (navigator) =>
  (business) =>
    <BusinessListItem business={business} businessClicked={() => navigator.push({
      id: 'BusinessDetails',
      business
    })}/>

const BusinessList = (props) =>
  props.loading
    ? <ActivityIndicator size='large' style={{flex: 1}}/>
    : <View style={{flex: 1}}>
        <ListView
          style={{flex: 1}}
          pageSize={10}
          dataSource={props.dataSource}
          renderRow={renderRow(props.navigator)}/>
      </View>

const mapStateToProps = (state) => ({...state.business})

export default connect(mapStateToProps)(BusinessList)
