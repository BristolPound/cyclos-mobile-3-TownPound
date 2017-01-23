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

  componentWillUpdate(nextProps) {
    if (this.props.listData !== nextProps.listData) {
      this.setState({ dataSource: buildDataSourceForTransactions(nextProps.listData, this.state.dataSource) })

      // If the user has been logged out due to attempting a payment when their token has expired
      if (nextProps.listData.length === 0) {
        // intentionally duplicated, otherwise won't work on iOS
        this.listViewRef.scrollTo({ y: 0 })
        this.listViewRef.scrollTo({ y: 0 })
      }
    }
  }

  render() {
    return (
      <ListView
        ref={(ref) => this.listViewRef = ref}
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
