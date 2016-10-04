import React from 'react'
import { View, TouchableHighlight} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../store/reducer/navigation'
import DefaultText from './DefaultText'
import ProfileImage from './profileImage/ProfileImage'

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
  <TouchableHighlight onPress={() => {props.openTraderModal(props.business.id)}}
            underlayColor='#dddddd' key={props.business.id}>
    <View style={styles.container}>
      <ProfileImage
        img={props.business.image}
        style={styles.image}
        alternativeStyle={styles.image}
        category='shop'/>
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
