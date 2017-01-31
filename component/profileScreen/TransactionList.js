import React, { Component } from 'react'
import { View, ListView } from 'react-native'
import DefaultText from '../DefaultText'
import commonStyle from '../style'
import TransactionItem from './TransactionItem'
import { buildDataSourceForTransactions} from '../../util/transaction'

export default class TransactionList extends Component {
  constructor(props) {
    super(props)
    this.state = { dataSource: buildDataSourceForTransactions(props.listData) }
  }

  componentWillUpdate(nextProps) {
    if (this.props.listData !== nextProps.listData) {
      // https://github.com/facebook/react-native/issues/11825
      // With this workaround, the only problem is the renderSeparator disappears
      this.setState({ dataSource: buildDataSourceForTransactions([]) })
      this.setState({ dataSource: buildDataSourceForTransactions(nextProps.listData, this.state.dataSource) })

      // If the user has been logged out due to attempting a payment when their token has expired
      if (nextProps.listData.length === 0) {
        // intentionally duplicated, otherwise won't work on iOS
        this.listViewRef.scrollTo({ y: 0, animated: false })
        this.listViewRef.scrollTo({ y: 0, animated: false })
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
        renderSectionHeader={renderSectionHeader}
        removeClippedSubviews={false}
        initialListSize={12}
        decelerationRate='fast' />
    )
  }
}

const renderSectionHeader = (sectionData, sectionID) =>
    <View style={commonStyle.sectionHeader.container} key={sectionID}>
      <DefaultText style={commonStyle.sectionHeader.text}>
        {sectionID}
      </DefaultText>
    </View>
