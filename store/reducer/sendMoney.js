import { putTransaction } from '../../api'
import merge from '../../util/merge'
import { successfulConnection, connectionFailed } from './networkConnection'
import NetworkError from '../../networkError'

const initialState = {
  payee: '',
  amount: undefined,
  loading: false,
  transactionResponse: undefined
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
    putTransaction(getState().login.sessionToken, {
      subject: getState().sendMoney.payee,
      description: 'Test description',
      amount: getState().sendMoney.amount
    })
    .then((response) =>{
      dispatch(successfulConnection())
      return response
    })
    .catch((err) => {
      if (err instanceof NetworkError) {
        dispatch(connectionFailed())
      } else {
        console.error(err)
      }
    })
    .then(response => dispatch(transactionComplete(response)))
  }

const setLoading = () => ({
  type: 'sendMoney/SET_LOADING'
})

const transactionComplete = (transactionResponse) => ({
  type: 'sendMoney/TRANSACTION_COMPLETE',
  transactionResponse
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
        transactionResponse: action.transactionResponse
      })
      break
  }
  return state
}

export default reducer
