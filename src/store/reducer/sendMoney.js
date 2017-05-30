import moment from 'moment'

import { makePayment } from '../../api/payments'
import merge from '../../util/merge'
import { loadMoreTransactions } from './transaction'
import { UNEXPECTED_ERROR, UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { logout } from './login'

const initialState = {
  payeeId: '',
  amount: '',
  amountPaid: '',
  loading: false,
  success: undefined,
  message: '',
  timestamp: undefined,
  inputPage: 0,
  transactionNumber: -1,
  resetClipboard: false,
  askToContinuePayment: false
}

const Page = {
  Ready: 0,
  EnterAmount: 1,
  ConfirmAmount: 2,
  MakingPayment: 3,
  PaymentComplete: 4
}

export const resetForm = () => ({
  type: 'sendMoney/RESET_FORM'
})

export const updatePayee = (payeeId) => ({
  type: 'sendMoney/UPDATE_PAYEE',
  payeeId
})

export const updatePage = (page) => ({
  type: 'sendMoney/UPDATE_PAGE',
  page
})

export const updateAmount = (amount) => ({
  type: 'sendMoney/UPDATE_AMOUNT',
  amount
})

export const returnToPayment = () => ({
  type: 'sendMoney/RETURN_TO_PAYMENT'
})

const setLoading = () => ({
  type: 'sendMoney/SET_LOADING'
})

const transactionComplete = (success, message, amountPaid, timestamp, transactionNumber) => ({
  type: 'sendMoney/TRANSACTION_COMPLETE',
  success,
  message,
  amountPaid,
  timestamp,
  transactionNumber
})

export const askToContinuePayment = (value) => ({
  type: 'sendMoney/ASK_CONTINUE_PAYMENT',
  value
})

export const sendTransaction = () =>
  (dispatch, getState) => {
    if (getState().sendMoney.loading) {
      return
    }
    dispatch(setLoading())
    const { payeeId, amount } = getState().sendMoney
    makePayment({
        subject: payeeId,
        description: 'Test description',
        amount: amount
      }, dispatch)
      .then((result) => {
        dispatch(loadMoreTransactions())
        dispatch(transactionComplete(true, 'Payment complete', amount, moment(result.date).format('MMMM Do YYYY, h:mm:ss a'), result.transactionNumber))
    })
      .catch(err => {
        if (err.type === UNAUTHORIZED_ACCESS) {
            dispatch(transactionComplete(false, 'Session expired', 0, null, null))
            dispatch(logout())
            dispatch(askToContinuePayment(true))
        } else if (err.type === UNEXPECTED_ERROR) {
          err.response.json()
            .then(json => {
              if (json && json.code === 'dailyAmountExceeded') {
                dispatch(transactionComplete(false, 'Daily amount has been exceeded.', 0, null, null))
              } else if (json && json.code === 'insufficientBalance') {
                dispatch(transactionComplete(false, 'Insufficient balance.', 0, null, null))
              } else {
                dispatch(transactionComplete(false, 'Error on sending transaction.', 0, null, null))
              }
            })
            .catch(() => dispatch(transactionComplete(false, 'Error on sending transaction.', 0, null, null)))
        } else {
          dispatch(transactionComplete(false, 'Error on sending transaction.', 0, null, null))
        }
      })
  }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'sendMoney/RESET_FORM':
      state = initialState
      break
    case 'sendMoney/UPDATE_PAYEE':
      state = merge(state, {
        payeeId: action.payeeId
      })
      break
    case 'sendMoney/UPDATE_AMOUNT':
      state = merge(state, {
        amount: action.amount
      })
      break
    case 'sendMoney/SET_LOADING':
      state = merge(state, {
        loading: true
      })
      break
    case 'sendMoney/UPDATE_PAGE':
      state = merge(state, {
        inputPage: action.page,
        resetClipboard: false
      })
      break
    case 'sendMoney/TRANSACTION_COMPLETE':
      var stateToUpdate = {
        success: action.success,
        message: action.message,
        amountPaid: action.amountPaid,
        timestamp: action.timestamp,
        loading: false,
        transactionNumber: action.transactionNumber
      }
      if (action.message !== 'Session expired') {
        stateToUpdate.amount = ''
        stateToUpdate.inputPage = Page.PaymentComplete
      }
      state = merge(state, stateToUpdate)
      break
    case 'sendMoney/RETURN_TO_PAYMENT':
      state = merge(state, {
        inputPage: Page.ConfirmAmount
      })
      break
    case 'navigation/OVERLAY_VISIBLE':
      if (action.value === false) {
        state = merge(state, {
          inputPage: Page.Ready,
          resetClipboard: true
        })
      }
      break
    case 'navigation/SHOW_MODAL':
      if (action.modalState === 'traderScreen') {
        state = merge(state, {
          inputPage: Page.Ready
        })
      }
      break
    case 'sendMoney/ASK_CONTINUE_PAYMENT':
      state = merge(state, {
        askToContinuePayment: action.value 
      })
  }
  return state
}

export default reducer
