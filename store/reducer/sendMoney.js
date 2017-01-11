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
  message: ''
}

export const resetForm = () => ({
  type: 'sendMoney/RESET_FORM'
})

export const updatePayee = (payee) => ({
  type: 'sendMoney/UPDATE_PAYEE',
  payee
})

export const updateAmount = (amount) => ({
  type: 'sendMoney/UPDATE_AMOUNT',
  amount
})

const setLoading = () => ({
  type: 'sendMoney/SET_LOADING'
})

const transactionComplete = (success, message) => ({
  type: 'sendMoney/TRANSACTION_COMPLETE',
  success,
  message
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
      .then(() => {

        dispatch(loadMoreTransactions())
        dispatch(transactionComplete(true, 'Paid ' + payee + ' ' + amount + ' at ' +
          moment().format('MMMM Do YYYY, h:mm:ss a')))
      })
      .catch(err => {
        if (err.type === UNAUTHORIZED_ACCESS) {
            dispatch(transactionComplete(false, 'Session expired'))
            dispatch(logout())
        } else if (err.type === UNEXPECTED_ERROR) {
          err.response.json()
            .then(json => {
              if (json && json.code === 'dailyAmountExceeded') {
                dispatch(transactionComplete(false, 'Daily amount has been exceeded.'))
              } else if (json && json.code === 'insufficientBalance') {
                dispatch(transactionComplete(false, 'Insufficient balance.'))
              } else {
                dispatch(transactionComplete(false, 'Error on sending transaction.'))
              }
            })
            .catch(() => dispatch(transactionComplete(false, 'Error on sending transaction.')))
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
    case 'sendMoney/TRANSACTION_COMPLETE':
      state = merge(initialState, {
        success: action.success,
        message: action.message,
      })
      break
  }
  return state
}

export default reducer
