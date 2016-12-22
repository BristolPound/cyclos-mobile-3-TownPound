import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TextInput, TouchableOpacity, ActivityIndicator, Dimensions, Animated } from 'react-native'
import KeyboardComponent from './KeyboardComponent'
import * as actions from '../store/reducer/sendMoney'
import { openLoginForm } from '../store/reducer/login'
import merge from '../util/merge'
import { LOGIN_STATUSES } from '../store/reducer/login'
import DefaultText from './DefaultText'
import color from '../util/colors'
import { dimensions } from '../util/StyleUtils'

const Page = {
  Ready: 0,
  EnterAmount: 1,
  MakingPayment: 2,
  PaymentComplete: 3,
}

const { width } = Dimensions.get('window')
export const sectionHeight = 68

const styles = {
  button: {
    height: sectionHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInnerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  textInput: {
    ...dimensions(width, sectionHeight),
    padding: 10,
    textAlign: 'center'
  },
  loadingSpinner: {
    backgroundColor: color.transparent,
    marginLeft: 20
  }
}

class InputComponent extends KeyboardComponent {
  getButtonColor() {
    const { input, invalidInput } = this.props
    if (input && input.value && invalidInput) {
      return color.offWhite
    }
    return color.bristolBlue
  }

  getButtonTextColor() {
    return this.getButtonColor() === color.offWhite ? 'black' : 'white'
  }

  render() {
    let { onButtonPress, buttonText, loading, input, invalidInput, accessibilityLabel } = this.props

    return <Animated.View style={{backgroundColor: 'white', bottom: input ? this.state.keyboardHeight : 0}} accessibilityLabel={accessibilityLabel}>
      <TouchableOpacity style={merge(styles.button, {backgroundColor: this.getButtonColor()})}
          onPress={() => invalidInput ? undefined : onButtonPress()}>
        <View style={styles.buttonInnerContainer}>
          <DefaultText style={{fontSize: 24, color: this.getButtonTextColor()}}>
            {buttonText}
          </DefaultText>

          { loading
            ? <ActivityIndicator size='small' style={styles.loadingSpinner}/>
            : undefined }
        </View>
      </TouchableOpacity>

      { input
        ? <TextInput style={styles.textInput}
              {...input}
              autoFocus={true}
              accessibilityLabel={input.placeholder} />
      : undefined }

    </Animated.View>
  }
}


class SendMoney extends React.Component {

  constructor() {
    super()
    this.state = {
      inputPage: Page.Ready,
    }
  }

  nextPage() {
    const nextPage = (this.state.inputPage + 1) % Object.keys(Page).length
    this.setState({ inputPage: nextPage })
    if (nextPage === Page.PaymentComplete) {
      setTimeout(() => {
        if (this.state.inputPage === Page.PaymentComplete) {
          this.nextPage()
        }
      }, 1800)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.businessId !== prevProps.businessId) {
      this.props.updateAmount('')
      this.setState({ inputPage: Page.Ready })
    } else if (prevProps.loading && !this.props.loading && this.state.inputPage === 2) {
      this.nextPage()
    }
  }

  render() {
    let inputProps

    if (this.props.loggedIn) {
      switch (this.state.inputPage){
        case Page.Ready: // Initial state, ready to begin
          inputProps = {
            buttonText: 'Send Payment',
            onButtonPress: () => { this.props.updatePayee(this.props.payeeShortDisplay); this.nextPage() },
            accessibilityLabel: 'Ready',
          }
          break
        case Page.EnterAmount: // provide amount
          inputProps = {
            buttonText: 'Pay ' + this.props.payeeDisplay,
            onButtonPress: () => { this.props.sendTransaction(); this.nextPage() },
            input: {
              keyboardType: 'numeric',
              value: this.props.amount,
              placeholder: 'Amount',
              onChangeText: amt => this.props.updateAmount(amt),
            },
            invalidInput: isNaN(Number(this.props.amount)) || Number(this.props.amount) > this.props.balance || Number(this.props.amount) <= 0,
            accessibilityLabel: 'Enter Amount',
          }
          break
        case Page.MakingPayment: // in progress
          inputProps = {
            buttonText: 'Making Payment',
            loading: true,
            accessibilityLabel: 'Making Payment',
          }
          break
        case Page.PaymentComplete: // payment completed
          inputProps = {
            buttonText: this.props.message,
            onButtonPress: () => { this.props.resetForm(); this.nextPage() },
            accessibilityLabel: 'Payment complete',
          }
          break
      }
    } else {
      inputProps = {
        buttonText: 'Log in to make payment',
        onButtonPress: () => this.props.openLoginForm(true),
        accessibilityLabel: 'Log in to make payment',
      }
    }

    return <InputComponent {...inputProps} />
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, openLoginForm }, dispatch)

const mapStateToProps = (state) => ({
  ...state.sendMoney,
  balance: state.account.balance,
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN
})

export default connect(mapStateToProps, mapDispatchToProps)(SendMoney)
