import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import BusinessListItem from './BusinessListItem'
import { ROW_HEIGHT } from './SearchTabStyle'

const renderRow = (business, index) =>
  <BusinessListItem business={business} key={index}/>

const BusinessList = (props) =>{
  return (
    props.loading
      ? <ActivityIndicator size='large' style={{flex: 1}}/>
      : <View style={{flex: 1, height: props.businessesToDisplay.length * ROW_HEIGHT}}>
          {props.businessesToDisplay.map(renderRow)}
        </View>
  )
}

export default BusinessList
