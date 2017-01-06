import React, { Component } from 'react'
import { View, ListView } from 'react-native'
import DefaultText from '../DefaultText'
import styles from './ProfileStyle'
import commonStyle from '../style'
import merge from '../../util/merge'
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
    this.state = { dataSource: buildDataSourceForTransactions(props.dataSource) }
    this.setSelected = this.setSelected.bind(this)
  }

  // update the transaction in data source to be selected/unselected
  setSelected(transactionNumber, newSelectedValue) {
     const ds = this.props.dataSource.slice()
     const index = ds.findIndex(transaction => transaction.transactionNumber === transactionNumber)
     const mod = merge(ds[index])
     mod.selected = newSelectedValue
     ds.splice(index,1,mod)
     this.setState({ dataSource: buildDataSourceForTransactions(ds, this.state.dataSource) })
  }

  render() {
    return (
      <ListView
        renderHeader={this.props.renderHeader}
        dataSource={this.state.dataSource}
        renderRow={transaction => this.props.renderRow
          || <TransactionItem transaction={transaction} setSelected={this.setSelected} selected={transaction.selected} />}
        renderSeparator={renderSeparator}
        renderSectionHeader={renderSectionHeader}/>
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
