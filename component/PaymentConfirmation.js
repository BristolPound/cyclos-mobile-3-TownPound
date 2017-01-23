import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closeConfirmation } from '../store/reducer/navigation'
import style from './PaymentConfirmationStyle'
import ProfileHeader from './profileScreen/ProfileHeader'
import DefaultText from './DefaultText'

const PaymentConfirmation = (props) => {

    const priceComponents = Math.abs(props.amount).toFixed(2).split('.')
    const priceBeforeDecimal = !isNaN(priceComponents[0]) ? priceComponents[0] : '-'
    const priceAfterDecimal = !isNaN(priceComponents[1]) ? priceComponents[1] : '--'

    return (
      props.message
      ? <View style={style.container}>
        	<View style={style.innerContainer}>
            <ProfileHeader
              name={props.trader.display}
              username={props.trader.shortDisplay}
              image={props.trader.image}
              category={props.trader.category}
              onPressClose={props.closeConfirmation}
              isModal={true}
              paymentComplete={true} />
            {renderPrice(priceBeforeDecimal, priceAfterDecimal)}
            {renderDetails(props.transactionNumber, props.timestamp)}
          </View>
          {renderButton()}
        </View>
      : null
    )
}

const renderButton = () =>
  <TouchableOpacity style={style.buttonContainer}>
      <View style={style.buttonInnerContainer}>
        <DefaultText style={style.buttonText}>
          Transaction complete
        </DefaultText>
      </View>
  </TouchableOpacity>

const renderPrice = (priceBeforeDecimal, priceAfterDecimal) =>
  <View style={style.priceContainer}>
    <View style={style.pricePoundLogoContainer}>
      <Image source={require('./common/assets/Shape.png')} style={style.pricePoundLogo} />
    </View>
    <DefaultText style={style.priceBeforeDecimal}>
        {priceBeforeDecimal}
    </DefaultText>
    <DefaultText style={style.priceAfterDecimal}>
        .{priceAfterDecimal}
    </DefaultText>
  </View>

const getDateOrTime = (timestamp, index) => {
  const res = timestamp.split(',')
  return res[index]
}

const renderDetails = (transactionNumber, timestamp) =>
  <View style={style.detailsContainer}>
    {renderSectionHeader()}
    {renderRow('Reference:', transactionNumber, true)}
    <View style={style.separator} />
    <View style={style.detailsInnerContainer}>
      {renderRow('Date:', getDateOrTime(timestamp, 0), false)}
      {renderRow('Time:', getDateOrTime(timestamp, 1), false)}
    </View>
  </View>

const renderRow = (title, data, reference) =>
  <View style={reference ? style.referenceContainer : style.rowContainer}>
    <DefaultText style={style.rowTitle}>{title}</DefaultText>
    <DefaultText style={style.rowData}>{data}</DefaultText>
  </View>

const renderSectionHeader = () =>
  <View style={style.sectionHeader.container}>
    <DefaultText style={style.sectionHeader.text}>
      Details
    </DefaultText>
  </View>

const mapStateToProps = (state) => ({
	trader: state.business.businessList.find(b => b.id === state.business.traderScreenBusinessId) || {},
	message: state.navigation.message,
	amount: state.navigation.amount,
  timestamp: state.navigation.timestamp,
  transactionNumber: state.navigation.transactionNumber
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ closeConfirmation }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirmation)
