import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Clipboard } from 'react-native'
import * as actions from '../../store/reducer/sendMoney'
import { openLoginForm, LOGIN_STATUSES } from '../../store/reducer/login'
import { setOverlayOpen } from '../../store/reducer/navigation'
import InputComponent from './InputComponent'

const Page = {
  Ready: 0,
  EnterAmount: 1,
  ConfirmAmount: 2,
  MakingPayment: 3,
  PaymentComplete: 4
}

let tempClipboardString = ''

class SendMoney extends React.Component {

  constructor () {
    super()
  }

  setClipboardContent = async () => {
    try {
      tempClipboardString = await Clipboard.getString()
    } catch (e) {
    } finally {
      Clipboard.setString('')
    }
  }

  nextPage () {
    const nextPage = (this.props.inputPage + 1) % Object.keys(Page).length
    this.props.updatePage(nextPage)
    if (nextPage === Page.EnterAmount) {
      this.setClipboardContent()
    } else if (nextPage === Page.MakingPayment) {
      Clipboard.setString(tempClipboardString)
    }
  }

  prevPage () {
    this.props.updatePage(Page.EnterAmount)
  }

  componentDidUpdate (prevProps) {
    if (this.props.payeeId !== prevProps.payeeId) {
      this.props.updateAmount('')
      this.props.updatePage(Page.Ready)
    } else if (prevProps.loading && !this.props.loading && this.props.inputPage === Page.MakingPayment) {
      this.nextPage()
    } else if (prevProps.inputPage === Page.MakingPayment
      && this.props.inputPage === Page.PaymentComplete
      && !this.props.success) {
      setTimeout(() => this.props.inputPage === Page.PaymentComplete && this.nextPage(), 1800)
    }
  }

  isInputInvalid () {
    const { amount } = this.props
    return (
      isNaN(Number(this.props.amount))
        || Number(amount) > this.props.balance
        || Number(amount) <= 0
        || (amount.charAt(0) === '0' && amount.charAt(1) !== '.')
        || amount.charAt(amount.length - 1) === '.'
        || (amount.split('.')[1] && amount.split('.')[1].length > 2)
    )
  }

  render () {
    let inputProps

    if (this.props.resetClipboard) {
      Clipboard.setString(tempClipboardString)
    }

    if (this.props.connection) {
      if (this.props.inputPage === Page.PaymentComplete) {
        inputProps = {
          buttonText: this.props.message,
          onButtonPress: () => {},
          accessibilityLabel: 'Payment complete'
        }
      } else if (this.props.loggedIn) {
        switch (this.props.inputPage) {
          case Page.Ready: // Initial state, ready to begin
            inputProps = {
              buttonText: 'Send Payment',
              onButtonPress: () => { this.nextPage() },
              accessibilityLabel: 'Ready'
            }
            break
          case Page.EnterAmount: // provide amount
            inputProps = {
              buttonText: 'Pay ' + this.props.payee.display,
              onButtonPress: () => { this.nextPage() },
              input: {
                keyboardType: 'numeric',
                value: this.props.amount,
                placeholder: 'Amount',
                onChangeText: amt => this.props.updateAmount(amt)
              },
              invalidInput: this.isInputInvalid(),
              accessibilityLabel: 'Enter Amount',
              balance: this.props.balance
            }
            break
          case Page.ConfirmAmount: // provide amount
            inputProps = {
              buttonText: 'Confirm',
              onButtonPress: () => { this.props.sendTransaction(); this.nextPage() },
              amount: this.props.amount,
              onChangeAmount: () => { this.prevPage() },
              accessibilityLabel: 'Confirm Amount'
            }
            break
          case Page.MakingPayment: // in progress
            inputProps = {
              buttonText: 'Making Payment',
              loading: true,
              accessibilityLabel: 'Making Payment'
            }
            break
        }
      } else {
        inputProps = {
          buttonText: 'Log in to make payment',
          onButtonPress: () => this.props.openLoginForm(true),
          accessibilityLabel: 'Log in to make payment'
        }
      }
    } else {
      inputProps = {
        buttonText: 'No internet connection',
        accessibilityLabel: 'No internet connection'
      }
    }

    return <InputComponent {...inputProps} setOverlayOpen={this.props.setOverlayOpen} />
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...actions, openLoginForm, setOverlayOpen }, dispatch)

const mapStateToProps = (state) => ({
  ...state.sendMoney,
  payee: state.business.businessList.find(b => b.id === state.sendMoney.payeeId) || state.person.selectedPerson || {},
  balance: state.account.balance,
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN,
  connection: state.networkConnection.status
})

export default connect(mapStateToProps, mapDispatchToProps)(SendMoney)
