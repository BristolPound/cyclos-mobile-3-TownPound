import React from 'react'
import { bindActionCreators } from 'redux'
import { ActivityIndicator, ListView, View, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import BusinessListItem from './BusinessListItem'
import * as actions from '../store/reducer/business'

const renderRow = (business) =>
  <BusinessListItem business={business}/>

const BusinessList = (props) =>
  props.loading
    ? <ActivityIndicator size='large' style={{flex: 1}}/>
    : <View style={{flex: 1}}>
        <ListView
          style={{flex: 1}}
          pageSize={10}
          dataSource={props.dataSource}
          renderRow={renderRow}
          refreshControl={<RefreshControl
            refreshing={props.refreshing}
            onRefresh={props.refreshBusinesses} />
          }/>
      </View>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({...state.business})

export default connect(mapStateToProps, mapDispatchToProps)(BusinessList)
