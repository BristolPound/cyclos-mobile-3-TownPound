import React from 'react'
import { Text, StyleSheet, View, Image, TouchableHighlight, ListView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import DefaultText from './DefaultText'
import Price from './Price'
import merge from '../util/merge'
import {BusinessDetails} from './businessdetails/BusinessDetails'

const borderColor = '#ddd'
const marginSize = 8

const styles = {
  title: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 25
  },
  subtitle: {
    alignSelf: 'center',
    marginTop: 5,
    fontSize: 18
  },
  image: {
    height: 150,
    width: 150,
    marginTop: 5,
    borderRadius: 20,
    alignSelf: 'center'
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
  buttonText: {
    alignSelf: 'center',
    fontSize: 18
  }
}

const TraderScreen = props =>
  <View style={{flex:1}}>
    <ListView
      style={{flex:10}}
      renderHeader={renderHeader(props)}
      dataSource={props.transaction.transactionsDataSource}
      renderRow={renderRow}
      renderSeparator={renderSeparator}
      renderSectionHeader={renderSectionHeader}
      />
    <BusinessDetailsFooterButton/>
  </View>

const renderHeader = ({showTraderScreen, selectedBusiness}) => () =>
  <TouchableHighlight onPress={() => showTraderScreen(false)}>
    <View style={{ height: 250 }}>
      { selectedBusiness.image
        ? <Image style={styles.image} source={{uri: selectedBusiness.image.url}}/>
        : <View style={styles.image}/> }
      <DefaultText style={styles.title}>{selectedBusiness.display}</DefaultText>
      <DefaultText style={styles.subtitle}>{selectedBusiness.shortDisplay}</DefaultText>
      <BusinessDetails business={selectedBusiness}/>
      <Text style={styles.subtitle}>{selectedBusiness.description}</Text>
    </View>
  </TouchableHighlight>

const renderRow = (transaction) =>
  <View key={transaction.transactionNumber}>
    <View style={styles.rowContainer}>
      { transaction.relatedAccount.user
        ? <DefaultText style={{marginLeft: 10}}>{transaction.relatedAccount.user.display}</DefaultText>
        : <DefaultText style={{marginLeft: 10}}>System</DefaultText> }
      <Price price={transaction.amount}/>
    </View>
  </View>

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={merge(styles.section, styles.sectionBorder)} key={sectionID}>
   <DefaultText style={styles.sectionHeader}>
     {sectionID}
   </DefaultText>
  </View>

const BusinessDetailsFooterButton = () =>
  <TouchableHighlight
     style={{flex:1}}
     onPress={() => console.log('TODO: Send payment')}>
    <Text style={styles.buttonText}>Send Payment</Text>
  </TouchableHighlight>

const mapStateToProps = (state) => ({
  selectedBusiness: state.business.selectedBusiness,
  transaction: state.transaction
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
