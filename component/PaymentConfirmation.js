import { TouchableHighlight, View, Image } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DefaultText from './DefaultText'
import { closeConfirmation } from '../store/reducer/navigation'
import ProfileImage from './profileImage/ProfileImage'
import styles from './profileScreen/ProfileStyle'
import style from './PaymentConfirmationStyle'

const PaymentConfirmation = (props) =>
  <TouchableHighlight onPress={props.closeConfirmation} style={style.background}>
  	<View style={style.background}>
  		<DefaultText>{props.message}</DefaultText>
  		<ProfileImage
        	image={props.trader.image && {uri: props.trader.image.url}}
        	style={styles.header.businessLogo}
        	category={props.trader.category}
        	colorCode={0} />
      <DefaultText style={style.title}>{props.trader.display}</DefaultText>
      <DefaultText style={style.subtitle}>{props.trader.shortDisplay}</DefaultText>
      <DefaultText style={style.time}>{props.timestamp}</DefaultText>
      <DefaultText>{props.amount}</DefaultText>
    </View>
  </TouchableHighlight>

const mapStateToProps = (state) => ({
	trader: state.business.businessList.find(b => b.id === state.business.traderScreenBusinessId) || {},
	message: state.navigation.message,
	amount: state.navigation.amount,
  timestamp: state.navigation.timestamp
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ closeConfirmation }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfirmation)
