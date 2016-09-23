import { putTransaction } from '../../api'
import merge from '../../util/merge'
import ApiError, {UNEXPECTED_ERROR} from '../../apiError'

const initialState = {
  payee: '',
  amount: undefined,
  loading: false,
  newTransaction: undefined,
  paymentFailed: ''
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

export const sendTransaction = () =>
  (dispatch, getState) => {
    dispatch(setLoading())
    putTransaction({
        subject: getState().sendMoney.payee,
        description: 'Test description',
        amount: getState().sendMoney.amount
      }, dispatch)
      .then(response =>
        dispatch(response.transactionNumber ? transactionComplete(response) : paymentFailed('Transaction did not complete.')))
      .catch(err => {
        if (err instanceof ApiError && err.type === UNEXPECTED_ERROR && err.json) {
          switch (err.json.code) {
            case 'dailyAmountExceeded':
              dispatch(paymentFailed('Daily amount has been exceeded.'))
              break
            case 'insufficientBalance':
              dispatch(paymentFailed('Insufficient balance.'))
              break
          }
        } else {
          dispatch(paymentFailed('Error on sending transaction.'))
          console.err(err)
        }
      })
  }

const setLoading = () => ({
  type: 'sendMoney/SET_LOADING'
})

const transactionComplete = (newTransaction) => ({
  type: 'sendMoney/TRANSACTION_COMPLETE',
  newTransaction
})

const paymentFailed = (paymentFailed) => ({
  type: 'sendMoney/PAYMENT_FAILED',
  paymentFailed
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'sendMoney/RESET_FORM':
      state = merge({}, initialState)
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
        newTransaction: action.newTransaction,
        paymentFailed: ''
      })
      break
    case 'sendMoney/PAYMENT_FAILED':
      state = merge(initialState, {
        newTransaction: undefined,
        paymentFailed: action.paymentFailed
      })
      break
  }
  return state
}

export default reducer
