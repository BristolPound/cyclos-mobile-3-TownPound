import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, TextInput, TouchableHighlight, ActivityIndicator, Dimensions } from 'react-native'

import * as actions from '../store/reducer/sendMoney'
import { openLoginForm } from '../store/reducer/login'
import merge from '../util/merge'
import { LOGIN_STATUSES } from '../store/reducer/login'
import DefaultText from './DefaultText'
import color from '../util/colors'

const Page = {
  Ready: 0,
  EnterAmount: 1,
  MakingPayment: 2,
  PaymentComplete: 3,
}

const { width } = Dimensions.get('window')
export const sectionHeight = 68

const styles = {
  container: {
    backgroundColor: 'white',
  },
  buttonContainer: {
    height: sectionHeight,
    backgroundColor: color.bristolBlue,
    alignItems: 'center',
    justifyContent: 'center',
    width: width
  },
  textInput: {
    width: width,
    padding: 10,
    height: sectionHeight,
    textAlign: 'center'
  },
  loadingSpinner: {
    backgroundColor: color.transparent,
    marginLeft: 20
  }
}

const InputComponent = (props) => {
  let { onButtonPress, buttonText, loading, input, invalidInput, accessibilityLabel } = props
  const buttonStyle = {fontSize: 24}

  return <View style={styles.container} accessibilityLabel={accessibilityLabel}>
    <TouchableHighlight
        onPress={() => !invalidInput && onButtonPress ? onButtonPress() : undefined }>
      <View style={merge(styles.buttonContainer, invalidInput ? {backgroundColor: color.offWhite} : {})}>
        <View style={{flexDirection: 'row'}}>
          <DefaultText style={input ? buttonStyle : merge(buttonStyle, {color: 'white'})}>
            {buttonText}
          </DefaultText>

          { loading
            ? <ActivityIndicator size='small' style={styles.loadingSpinner}/>
            : undefined }
        </View>
      </View>
    </TouchableHighlight>

    { input
      ? <TextInput style={styles.textInput}
            {...input}
            autoFocus={true}
            accessibilityLabel={input.placeholder} />
      : undefined }

  </View>
}


class SendMoney extends React.Component {

  constructor() {
    super()
    this.state = {
      inputPage: Page.Ready,
    }
  }

  nextPage() {
    const nextPage = (this.state.inputPage + 1) % 4
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
    if (prevProps.loading && !this.props.loading && this.state.inputPage === 2) {
      this.nextPage()
    }
  }

  render() {
    let inputProps

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
          invalidInput: this.props.amount &&
            (isNaN(Number(this.props.amount)) || Number(this.props.amount) > this.props.balance || Number(this.props.amount) <= 0),
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

    return <View>
      { this.props.loggedIn
        ? <InputComponent {...inputProps} />
        : <TouchableHighlight onPress={() => this.props.openLoginForm(true)}
              style={styles.buttonContainer}>
            <DefaultText>Log in to make payment</DefaultText>
          </TouchableHighlight>
      }
    </View>
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
