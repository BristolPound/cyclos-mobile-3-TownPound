import moment from 'moment'

import { makePayment } from '../../api/payments'
import merge from '../../util/merge'
import { loadMoreTransactions } from './transaction'
import { UNEXPECTED_ERROR, UNAUTHORIZED_ACCESS } from '../../api/apiError'
import { logout } from './login'

const initialState = {
  payee: '',
  amount: undefined,
  loading: false,
  success: undefined,
  message: '',
  timestamp: undefined,
  inputPage: undefined
}

const Page = {
  Ready: 0,
  EnterAmount: 1,
  MakingPayment: 2,
  PaymentComplete: 3,
}

export const resetForm = () => ({
  type: 'sendMoney/RESET_FORM'
})

export const updatePayee = (payee) => ({
  type: 'sendMoney/UPDATE_PAYEE',
  payee
})

export const updatePage = (page) => ({
  type: 'sendMoney/UPDATE_PAGE',
  page
})

export const updateAmount = (amount) => ({
  type: 'sendMoney/UPDATE_AMOUNT',
  amount
})

const setLoading = () => ({
  type: 'sendMoney/SET_LOADING'
})

const transactionComplete = (success, message, amount, timestamp, transactionNumber) => ({
  type: 'sendMoney/TRANSACTION_COMPLETE',
  success,
  message,
  amount,
  timestamp,
  transactionNumber
})

export const sendTransaction = () =>
  (dispatch, getState) => {
    dispatch(setLoading())
    const { payee, amount } = getState().sendMoney
    makePayment({
        subject: payee,
        description: 'Test description',
        amount: amount
      }, dispatch)
      .then((result) => {

        dispatch(loadMoreTransactions())
        dispatch(transactionComplete(true, 'Transaction complete', amount, moment().format('MMMM Do YYYY, h:mm:ss a'), result.transactionNumber))
      })
      .catch(err => {
        if (err.type === UNAUTHORIZED_ACCESS) {
            dispatch(transactionComplete(false, 'Session expired', 0, null))
            dispatch(logout())
        } else if (err.type === UNEXPECTED_ERROR) {
          err.response.json()
            .then(json => {
              if (json && json.code === 'dailyAmountExceeded') {
                dispatch(transactionComplete(false, 'Daily amount has been exceeded.', 0, null))
              } else if (json && json.code === 'insufficientBalance') {
                dispatch(transactionComplete(false, 'Insufficient balance.', 0, null))
              } else {
                dispatch(transactionComplete(false, 'Error on sending transaction.', 0, null))
              }
            })
            .catch(() => dispatch(transactionComplete(false, 'Error on sending transaction.', 0, null)))
        } else {
          dispatch(transactionComplete(false, 'Error on sending transaction.'))
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
        payee: action.payee
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
        inputPage: action.page
      })
      break
    case 'navigation/OVERLAY_VISIBLE':
      if ( state.inputPage === Page.EnterAmount && state.amount == '' ) {
        state = merge(state, {
          inputPage: Page.Ready
        })
      }
      state = merge(state, {
          overlayVisible: action.value
      })
      break
    case 'sendMoney/TRANSACTION_COMPLETE':
      state = merge(initialState, {
        success: action.success,
        message: action.message,
        amount: undefined,
        timestamp: action.timestamp
      })
      break
  }
  return state
}

export default reducer
