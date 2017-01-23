import React, { Component } from 'react'
import { View, ListView } from 'react-native'
import DefaultText from '../DefaultText'
import styles from './ProfileStyle'
import commonStyle from '../style'
import TransactionItem from './TransactionItem'
import { buildDataSourceForTransactions} from '../../util/transaction'

/** Specialisation of  a ListView rendering rows of transactions.
 *
 * @param props
 * @constructor
 */

export default class TransactionList extends Component {
  constructor(props) {
    super(props)
    this.state = { dataSource: buildDataSourceForTransactions(props.listData) }
  }

  componentDidUpdate(lastProps) {
    if (this.props.listData !== lastProps.listData) {
      this.setState({ dataSource: buildDataSourceForTransactions(this.props.listData, this.state.dataSource) })
    }
  }

  render() {
    return (
      <ListView
        renderHeader={this.props.renderHeader}
        dataSource={this.state.dataSource}
        renderRow={this.props.renderRow || TransactionItem}
        renderSeparator={renderSeparator}
        renderSectionHeader={renderSectionHeader}
        removeClippedSubviews={false}
        />
    )
  }
}

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.list.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
    <View style={commonStyle.sectionHeader.container} key={sectionID}>
      <DefaultText style={commonStyle.sectionHeader.text}>
        {sectionID}
      </DefaultText>
    </View>
