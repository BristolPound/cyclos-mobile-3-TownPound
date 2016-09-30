import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet } from 'react-native'
import _ from 'lodash'
import * as actions from '../store/reducer/business'

const DEBOUNCE_DURATION = 200

const BackgroundMap = (props) =>
  <MapView style={{...StyleSheet.absoluteFillObject}}
      region={props.mapViewport}
      onRegionChange={_.debounce(props.updateMapViewport, DEBOUNCE_DURATION)}>
    {props.businessList
      ?  props.businessList.filter(b => b.address)
          .map(b =>
              <MapView.Marker key={b.id}
                  coordinate={b.address.location}
                  onPress={() => props.updateMapViewport(b.address.location)}/>
                )
      : undefined}
  </MapView>

const mapStateToProps = (state) => ({
  ...state.business
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
