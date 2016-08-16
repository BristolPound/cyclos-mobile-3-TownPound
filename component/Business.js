import React from 'react'
import { Navigator } from 'react-native'
import { connect } from 'react-redux'
import BusinessList from './BusinessList'
import BusinessDetails from './BusinessDetails'

const Business = (props) =>
  <Navigator
    initialRoute={{ id: 'BusinessList' }}
    renderScene={(route, navigator) => {
      if (route.id === 'BusinessList') {
        return <BusinessList business={props.business} navigator={navigator}/>
      } else {
        return <BusinessDetails business={route.business} navigator={navigator}/>
      }
    }}
  />

const mapStateToProps = (state) => ({business: state.business})

export default connect(mapStateToProps)(Business)
