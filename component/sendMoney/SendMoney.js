import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View } from 'react-native'

import InputComponent from './InputComponent'
import * as actions from '../../store/reducer/sendMoney'
import merge from '../../util/merge'
import { LOGIN_STATUSES } from '../../store/reducer/login'

// In time this can be expanded to store the functions for each state.
const Page = {
  Ready: 0,
  EnterAmount: 1,
  MakingPayment: 2,
  PaymentComplete: 3,
}

class SendMoney extends React.Component {

  constructor() {
    super()
    this.state = {
      inputPage: Page.Ready,
    }
  }

  nextPage() {
    this.setState({ inputPage: (this.state.inputPage + 1) % 4 })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading && this.state.inputPage === 2) {
      this.nextPage()
    }
  }

  render() {
    let inputProps = {
      onRequestClose: () => { this.props.resetForm(); this.setState({ inputPage: 0 }) },
    }

    switch (this.state.inputPage){
      case Page.Ready: // Initial state, ready to begin
        inputProps = merge(inputProps, {
          buttonText: 'Send Money',
          onButtonPress: () => { this.props.updatePayee(this.props.payeeShortDisplay); this.nextPage() },
          description: 'Ready',
        })
        break
      case Page.EnterAmount: // provide amount
        inputProps = merge(inputProps, {
          buttonText: 'Pay ' + this.props.payeeDisplay,
          onButtonPress: () => { this.props.sendTransaction(); this.nextPage() },
          input: {
            keyboardType: 'numeric',
            value: this.props.amount,
            placeholder: 'Amount',
            onChangeText: amt => this.props.updateAmount(amt),
          },
          invalidInput: isNaN(Number(this.props.amount)) || Number(this.props.amount) > this.props.balance || Number(this.props.amount) <= 0,
          textBelowInput: 'Current Balance: ' + this.props.balance,
          description: 'Enter Amount',
        })
        break
      case Page.MakingPayment: // in progress
        inputProps = merge(inputProps, {
          buttonText: 'Making Payment',
          loading: true,
          description: 'Making Payment',
        })
        break
      case Page.PaymentComplete: // payment completed
        inputProps = merge(inputProps, {
          buttonText: 'Payment: ' + (this.props.success ? 'Successful' : ('Failed.' + this.props.message)),
          onButtonPress: () => { this.props.resetForm(); this.nextPage() },
          description: 'Payment Complete',
        })
        break
    }

    return <View>
      { this.props.loggedIn
        ? <InputComponent {...inputProps} />
        : undefined }
    </View>
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

const mapStateToProps = (state) => ({
  ...state.sendMoney,
  balance: state.account.balance,
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN
})

export default connect(mapStateToProps, mapDispatchToProps)(SendMoney)
