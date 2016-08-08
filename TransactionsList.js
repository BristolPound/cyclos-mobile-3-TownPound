import React from 'react'
import { StyleSheet, ListView, View, Image, ActivityIndicator, TouchableHighlight } from 'react-native'
import DefaultText from './DefaultText'
import Price from './Price'
import { connect } from 'react-redux'
import merge from './merge'
import BalanceHeader from './BalanceHeader'
import { loadMoreTransactions } from './store/reducer/transaction'

const borderColor = '#ddd'
const marginSize = 8

const styles = {
  image: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 10,
    borderColor: borderColor,
    borderWidth: 1
  },
  rowContainer: {
    flexDirection: 'row',
    margin: marginSize,
    alignItems: 'center'
  },
  sectionBorder: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: borderColor,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  section: {
    height: 40,
    backgroundColor: '#efefef',
    flexDirection: 'row'
  },
  separator: {
    marginLeft: marginSize,
    marginRight: marginSize,
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
    alignSelf:'center'
  }
}

const renderSeparator = () =>
  <View style={styles.separator}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={merge(styles.section, styles.sectionBorder)} ke={sectionID}>
   <DefaultText style={styles.sectionHeader}>
     {sectionID}
   </DefaultText>
  </View>

const renderRow = (transaction) =>
  <View style={styles.rowContainer} key={transaction.transactionNumber}>
    { transaction.accountOwner.image ? <Image style={styles.image} source={{uri: transaction.accountOwner.image.url}}/> : <View style={styles.image} /> }
    <DefaultText style={{marginLeft: 10}}>{transaction.accountOwner.name}</DefaultText>
    <Price price={transaction.amount}/>
  </View>

const renderLoadingFooter = () =>
  <View style={merge(styles.section, styles.sectionBorder, {justifyContent: 'center'})}>
    <ActivityIndicator/>
  </View>

const renderFooter = (onPress) =>
  <TouchableHighlight onPress={onPress}>
    <View style={merge(styles.section, styles.sectionBorder)}>
      <DefaultText style={merge(styles.sectionHeader, {color: '#1480ba'})}>Load more ...</DefaultText>
    </View>
  </TouchableHighlight>


const TransactionsList = (props) =>
  <View style={{flex:1}}>
    <BalanceHeader balance={props.balance} loadingBalance={props.loadingBalance}/>
    {props.loadingTransactions
      ? <ActivityIndicator size='large' style={{flex: 1}}/>
      : <ListView
          style={{flex: 1, marginBottom: 20}}
          pageSize={10}
          dataSource={props.dataSource}
          renderSeparator={renderSeparator}
          renderSectionHeader={renderSectionHeader}
          renderFooter={() =>
              props.loadingMoreTransactions
              ? renderLoadingFooter()
              : renderFooter(() => props.loadMore(props.page + 1))}
          renderRow={renderRow}/>}
  </View>


const mapDispatchToProps = (dispatch) => ({
  loadMore: (page) => {
    dispatch(loadMoreTransactions(page))
  }
})

const mapStateToProps = (state) => ({...state.transaction})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsList)
