import React from 'react'
import { Animated, BackHandler, Text, View, TouchableOpacity, Image } from 'react-native'
import animateTo from '../util/animateTo'
import merge from '../util/merge'
import { screenWidth } from '../util/ScreenSizes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Config from '@Config/config'
import { openLoginForm } from '../store/reducer/login'
import { showModal, modalState, setMenuOpen, showMenuAction, menuActions } from '../store/reducer/navigation'
import { LOGIN_STATUSES } from '../store/reducer/login'
import DefaultText from './DefaultText'
import Colors from '@Colors/colors'
import Price from './Price'
import Images from '@Assets/images'
import style from './MenuStyle'

const modalSlideTime = 300


class Menu extends React.Component {
  constructor () {
    super()
    this.state = { left: new Animated.Value(screenWidth), right: new Animated.Value(-screenWidth), active: false }
    this.onBackButtonPressBound = this.onBackButtonPress.bind(this)
  }
  onBackButtonPress () {
    this.props.menuOpen && this.props.setMenuOpen()
    return true
  }
  componentDidUpdate (lastProps) {
    if (this.props.menuOpen && !lastProps.menuOpen) {
      this.setState({ active: true })
      animateTo(this.state.left, 100, modalSlideTime, undefined, ()=>{})
      animateTo(this.state.right, 0, modalSlideTime, undefined, ()=>{})
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressBound)
    }
    if (!this.props.menuOpen && lastProps.menuOpen) {
      animateTo(this.state.left, screenWidth, modalSlideTime, undefined, () => this.setState({ active: false }))
      animateTo(this.state.right, -screenWidth, modalSlideTime, undefined, () => {})
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressBound)
    }
  }
  render () {
    return (
      <Animated.View style={merge(style.container, { left: this.state.left, right: this.state.right })}>
        <View style={style.amountContainer}>
        {
            this.props.loggedIn
            ? <View style={style.amountInnerContainer}>
                <Image source={Images.balanceSymbol} style={style.balanceSymbol}/>
                <Price
                    style={style.amount}
                    price={this.props.balance}
                    prefix=''
                    size={30}
                    color={Colors.primaryBlue}/>
                </View>
            : <TouchableOpacity
                    style={style.centerChildren}
                    onPress={this.props.connection ? () => this.props.openLoginForm(true) && this.props.setMenuOpen() : undefined}
                    accessibilityLabel='Log in Tab'>
                <View>
                    <DefaultText style={{ color: this.props.connection ? Colors.primaryBlue : Colors.offWhite }}>Log in</DefaultText>
                </View>
            </TouchableOpacity>
        }
        </View>
        <View style={style.separator} />
        <TouchableOpacity
                style={style.centerChildren}
                onPress={this.props.connection ? () => this.props.showMenuAction(menuActions.contactList) && this.props.setMenuOpen() : undefined}
                accessibilityLabel='Contact List'>
            <View>
                <DefaultText style={{ color: this.props.connection ? Colors.primaryBlue : Colors.offWhite }}>Contact List</DefaultText>
            </View>
        </TouchableOpacity>
        <View style={style.separator} />
        <Text>
            {Config.VERSION}
        </Text>
      </Animated.View>
    )
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    openLoginForm,
    showModal,
    setMenuOpen,
    showMenuAction
}, dispatch)

const mapStateToProps = (state) => ({
    menuOpen: state.navigation.menuOpen,
    connection: state.networkConnection.status,
    loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN,
    balance: state.account.balance,
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
