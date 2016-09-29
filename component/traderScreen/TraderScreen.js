import React from 'react'
import { StyleSheet, View, Image, TouchableHighlight, ListView, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../store/reducer/navigation'
import DefaultText from '../DefaultText'
import Price from '../Price'
import merge from '../../util/merge'
import {BusinessDetails} from '../businessDetails/BusinessDetails'
import SendMoney from '../SendMoney'
import CategoryImage from '../categoryImage/CategoryImage'
import colors from '../../util/colors'
import HTMLView from 'react-native-htmlview'
import {format} from '../../util/date'

const styles = {
  separator: {
    borderBottomColor: colors.grey5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grey5,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  header: {
    closeIcon: {
      marginLeft: 24,
      marginTop: 40,
      height: 17,
      width: 17
    },
    expandIcon: {
      marginRight: 24,
      marginTop: 40,
      height: 16,
      width: 16
    },
    businessLogo: {
      height: 84,
      width: 84,
      alignSelf: 'center',
      borderColor: colors.bristolBlue,
      borderRadius: 5,
      borderWidth: 2
    },
    title: {
      //fontFamily: 'MuseoSans-500',
      alignSelf: 'center',
      marginTop: 8,
      fontSize: 20,
      color: colors.offBlack
    },
    subtitle: {
      alignSelf: 'center',
      marginBottom: 46,
      fontSize: 18,
      color: colors.grey
    },
  },
  businessDetails: {
    description: {
      marginLeft: 24,
      marginRight: 24,
      marginTop: 18,
      marginBottom:0
    }
  },
  list: {
    rowContainer: {
      flexDirection: 'row',
      marginTop: 14,
      marginBottom: 14,
      marginLeft: 14,
      marginRight: 14
    },
    date: {
      alignSelf: 'center'
    },
    transactionNumber: {
      //fontFamily: 'MuseoSans-100',
      fontSize: 16,
      alignSelf: 'center'
    },
    price: {
      width:90,
      flex:0
    },
    sectionBorder: {
      borderColor: colors.grey5,
      borderWidth: StyleSheet.hairlineWidth,
    },
    sectionHeader: {
      backgroundColor: colors.offWhite,
      flexDirection: 'row'
    },
    sectionHeaderText: {
      color: colors.grey5,
      marginLeft: 14
    },
    separator: {
      marginLeft: 14,
      marginRight: 0,
      borderBottomColor: colors.grey5,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.grey5,
      borderTopWidth: StyleSheet.hairlineWidth
    },
  },
  paymentButton: {
    container: {
      backgroundColor: colors.bristolBlue,
      paddingTop: 20,
      paddingBottom: 20
    },
    buttonText: {
      //fontFamily: 'MuseoSans-500',
      color: colors.white,
      alignSelf: 'center',
      fontSize: 24
    }
  }
}

const TraderScreen = props =>
  props.selectedBusiness.profilePopulated
   ? <View style={{flex:1}}>
    <ListView
      style={{flex:10}}
      renderHeader={renderHeader(props)}
      dataSource={props.dataSource}
      renderRow={renderRow}
      renderSeparator={renderSeparator}
      renderSectionHeader={renderSectionHeader}
      />
    <SendMoney payeeDisplay={props.selectedBusiness.display} payeeShortDisplay={props.selectedBusiness.shortDisplay}/>
  </View>
  : <ActivityIndicator size='large'/>

  const renderHeader = ({showTraderScreen, selectedBusiness}) => () =>
    <View style={{flex:1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableHighlight onPress={() => showTraderScreen(false)}>
          <Image
            style={styles.header.closeIcon}
            source={require('./Close.png')}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => showTraderScreen(false)}>
          <Image
            style={styles.header.expandIcon}
            source={require('./Expand.png')}
          />
        </TouchableHighlight>
      </View>
      { selectedBusiness.image
        ? <Image style={styles.header.businessLogo} source={{uri: selectedBusiness.image.url}}/>
        : <CategoryImage style={styles.header.businessLogo} category='shop'/> }
      <DefaultText style={styles.header.title}>{selectedBusiness.display}</DefaultText>
      <DefaultText style={styles.header.subtitle}>{selectedBusiness.shortDisplay}</DefaultText>
      <View style={styles.separator}/>
      <BusinessDetails style ={styles.businessDetails.show} business={selectedBusiness}/>
      {selectedBusiness.description ? <View style={styles.separator}/> : null}
      <View style={styles.businessDetails.description}>
        <HTMLView value={selectedBusiness.description}/>
      </View>
    </View>

const renderRow = (transaction) =>
  <View style={styles.list.rowContainer} key={transaction.transactionNumber}>
    <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between'}}>
      <DefaultText style={styles.list.date}>{format(transaction.date, 'DD MMMM')}</DefaultText>
      <DefaultText style={styles.list.transactionNumber}>{transaction.transactionNumber}</DefaultText>
      <Price style={styles.list.price} price={transaction.amount}/>
    </View>
  </View>

const renderSeparator = (sectionID, rowID) =>
  <View style={styles.list.separator} key={`sep:${sectionID}:${rowID}`}/>

const renderSectionHeader = (sectionData, sectionID) =>
  <View style={merge(styles.list.sectionHeader, styles.list.sectionBorder)} key={sectionID}>
   <DefaultText style={styles.list.sectionHeaderText}>
     {sectionID}
   </DefaultText>
  </View>

const mapStateToProps = (state) => ({
  selectedBusiness: state.business.businessList.find(b => b.id === state.business.selectedBusinessId),
  dataSource: state.business.traderTransactionsDataSource,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
