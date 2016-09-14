import React from 'react'
import { View, TouchableHighlight, Image } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../store/reducer/navigation'
import DefaultText from './DefaultText'

const styles = {
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white'
  },
  image: {
    backgroundColor: '#ddd',
    width: 50,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1
  },
  verticalStack: {
    flex: 2.5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
    height: 50
  },
  title: {
    fontSize: 20,
    flex: 2.5
  }
}

const BusinessListItem = props =>
  <TouchableHighlight onPress={() => props.showBusinessDetails(props.business)}
            underlayColor='#dddddd' key={props.business.id}>
    <View style={styles.container}>
      { props.business.image ? <Image style={styles.image} source={{uri: props.business.image.url}}/> : <View style={styles.image}/> }
      <View style={styles.verticalStack}>
        <DefaultText style={styles.title} numberOfLines={1}>
          {props.business.display}
        </DefaultText>
        <DefaultText style={{color: '#777', fontSize: 12}}>
          @{props.business.shortDisplay}
        </DefaultText>
      </View>
    </View>
  </TouchableHighlight>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(() => ({}), mapDispatchToProps)(BusinessListItem)
