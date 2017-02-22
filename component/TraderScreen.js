import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Dimensions, ScrollView } from 'react-native'
import * as actions from '../store/reducer/navigation'
import TransactionList from './profileScreen/TransactionList'
import ProfileHeader from './profileScreen/ProfileHeader'
import BusinessDetails from './businessDetails/BusinessDetails'
import { sectionHeight } from './SendMoney'
import { resetForm } from '../store/reducer/sendMoney'
import { goToLocation } from '../store/reducer/navigation'
import { isIncorrectLocation } from '../util/business'
import DefaultText from './DefaultText'

import merge from '../util/merge'

// empty defaultText is needed so the transaction list doesn't disappear on expand details
const TraderScreen = (props) => {
  let goToTraderLocation
  if (props.trader.address && props.trader.address.location && !isIncorrectLocation(props.trader.address.location)) {
    goToTraderLocation = () => {
      const region = merge(props.trader.address.location, { latitudeDelta: 0.006, longitudeDelta: 0.006 })
      props.goToLocation(region)
    }
  }
  return (
      <View style={{maxHeight: Dimensions.get('window').height - sectionHeight}}>
      <ScrollView>
        <ProfileHeader
            name={props.trader.display}
            username={props.trader.shortDisplay}
            image={props.trader.image}
            category={props.trader.category}
            address={props.trader.address}
            onPressClose={() => {props.hideModal(); props.resetForm()}}
            isModal={true}
            showMap={props.modalOpen}
            goToTraderLocation={() => goToTraderLocation()}/>
        <BusinessDetails business={props.trader} goToTraderLocation={() => goToTraderLocation()}/>
        <DefaultText style={{height: 0}}></DefaultText>
        <TransactionList
          listData={props.transactions} />
        </ScrollView>
      </View>
  )
}

const getTransactionsForSelectedBusiness = (state) => {
  return state.transaction.transactions.filter(transaction => {
    return transaction.relatedAccount.kind === 'user' && transaction.relatedAccount.user.id === state.business.traderScreenBusinessId
  })
}

// Redux Setup
const mapStateToProps = (state) => ({
    trader: state.business.businessList.find(b => b.id === state.business.traderScreenBusinessId) || {},
    transactions: getTransactionsForSelectedBusiness(state),
    modalOpen: state.navigation.modalOpen
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, resetForm, goToLocation }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
