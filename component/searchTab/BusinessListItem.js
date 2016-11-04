import React from 'react'
import {View, TouchableHighlight} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from '../../store/reducer/navigation'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import styles from './BusinessListStyle'
import colors from '../../util/colors'
import merge from '../../util/merge'

const BusinessListItem = props =>
  <TouchableHighlight
    style={props.isSelected ? styles.listItem.selected : {}}
    key={props.business.id}
    onPress={() => { props.openTraderModal(props.business.id) }}
    underlayColor={colors.gray5}>
    <View
      style={props.isSelected ? merge(styles.listItem.container, styles.listItem.containerSelected) : styles.listItem.container}>
      <View
        style={props.isSelected ? merge(styles.listItem.status, styles.listItem.statusSelected) : styles.listItem.status}/>
      <View style={styles.listItem.contents}>
        <ProfileImage
          img={props.business.image}
          style={styles.listItem.image}
          category={props.business.category}/>
        <View style={styles.listItem.verticalStack}>
          <DefaultText style={styles.listItem.title}>
            {props.business.display}
          </DefaultText>
          <DefaultText style={styles.listItem.shortDisplay}>
            {props.business.shortDisplay}
          </DefaultText>
        </View>
      </View>
    </View>
  </TouchableHighlight>

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(() => ({}), mapDispatchToProps)(BusinessListItem)
