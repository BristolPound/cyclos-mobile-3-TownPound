import React from 'react'
import { View, Image, TouchableHighlight, ListView, ActivityIndicator, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../store/reducer/navigation'
import DefaultText from '../DefaultText'
import Price from '../Price'
import merge from '../../util/merge'
import {BusinessDetails} from '../businessDetails/BusinessDetails'
import SendMoney from '../SendMoney'
import CategoryImage from '../categoryImage/CategoryImage'
import HTMLView from 'react-native-htmlview'
import {format} from '../../util/date'
import styles from './TraderStyle'

const buttonHeight= 60

const TraderScreen = props =>
  props.selectedBusiness.profilePopulated
   ? <View style={styles.flex}>
    <ListView
      style= {{flex: 0, maxHeight: Dimensions.get('window').height - buttonHeight}}
      renderHeader={renderHeader(props)}
      dataSource={props.dataSource}
      renderRow={renderRow}
      renderSeparator={renderSeparator}
      renderSectionHeader={renderSectionHeader}
      />
    <View style={styles.footer}>
      <SendMoney
        payeeDisplay={props.selectedBusiness.display}
        payeeShortDisplay={props.selectedBusiness.shortDisplay}/>
    </View>
  </View>
  : <ActivityIndicator size='large'/>

  const renderHeader = ({showTraderScreen, selectedBusiness}) => () =>
    <View style={styles.flex}>
      <View style={styles.dropshadow}>
        <View style={styles.rowLayout}>
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
          : <CategoryImage style={styles.header.businessNoLogo} category='shop'/> }
        <DefaultText style={styles.header.title}>{selectedBusiness.display}</DefaultText>
        <DefaultText style={styles.header.subtitle}>{selectedBusiness.shortDisplay}</DefaultText>
      </View>
      <View style={styles.dropshadow}>
         <BusinessDetails business={selectedBusiness}/>
        {selectedBusiness.description ? <View style={styles.separator}/> : null}
        {selectedBusiness.description
          ? <View style={styles.businessDetails.description}>
              <HTMLView value={selectedBusiness.description}/>
            </View>
          : null }
      </View>
    </View>

const renderRow = (transaction) =>
  <View style={styles.list.rowContainer} key={transaction.transactionNumber}>
    <View style={styles.rowLayout}>
      <DefaultText style={styles.list.date}>{format(transaction.date, 'DD MMMM')}</DefaultText>
      <DefaultText style={styles.list.transactionNumber}>{transaction.transactionNumber}</DefaultText>
      <Price
        style={styles.list.price}
        size={20}
        smallFontSize={16}
        price={transaction.amount}/>
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
  dataSource: state.business.traderTransactionsDataSource
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
