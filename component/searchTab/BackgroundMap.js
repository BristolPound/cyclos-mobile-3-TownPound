import React from 'react'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet } from 'react-native'
import _ from 'lodash'
import * as actions from '../../store/reducer/business'

const MAP_PAN_DEBOUNCE_DURATION = 50

class BackgroundMap extends React.Component {
  constructor() {
    super()
    this.panned = false
  }

  updateViewport(...args) {
    this.panned = true
    this.props.updateMapViewport(...args)
  }

  render() {
    return (
      <MapView style={{...StyleSheet.absoluteFillObject}}
          region={this.panned ? undefined : this.props.mapViewport}
          onRegionChange={_.debounce(this.updateViewport.bind(this), MAP_PAN_DEBOUNCE_DURATION)}>
        {this.props.businessList
          ? this.props.businessList.filter(b => b.address)
              .map(b =>
                <MapView.Marker key={b.id}
                    coordinate={b.address.location}
                    onPress={() => this.updateViewport(b.address.location)}/>
              )
          : undefined}
      </MapView>
    )
  }
}


const mapStateToProps = (state) => ({
  ...state.business
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap)
