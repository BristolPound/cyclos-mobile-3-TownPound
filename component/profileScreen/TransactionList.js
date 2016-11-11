import React from 'react'
import { View, ListView, Dimensions } from 'react-native'
import DefaultText from '../DefaultText'
import merge from '../../util/merge'
import styles from './ProfileStyle'
import TransactionItem from './TransactionItem'

const buttonHeight= 60

/** Specialisation of  a ListView rendering rows of transactions.
 *
 * @param props
 * @constructor
 */
const TransactionList = (props) =>
  <ListView
    style= {{flex: 0, maxHeight: Dimensions.get('window').height - buttonHeight}}
    renderHeader={props.renderHeader}
    dataSource={props.dataSource}
    renderRow={props.renderRow || TransactionItem}
    renderSeparator={renderSeparator}
    renderSectionHeader={renderSectionHeader}/>

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.list.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={merge(styles.list.sectionHeader, styles.list.sectionBorder)} key={sectionID}>
    <DefaultText style={styles.list.sectionHeaderText}>
      {sectionID}
    </DefaultText>
  </View>

export default TransactionList