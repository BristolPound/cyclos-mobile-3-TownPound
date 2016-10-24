import { get, getPages } from './api'
import merge from '../util/merge'

const PAGE_SIZE = 100

export const getAccountBalance = (dispatch) =>
  get('self/accounts', {
    fields: ['status.balance']
  },
  dispatch)

export const getTransactions = (dispatch, additionalParams, successCriteria) =>
  getPages(PAGE_SIZE,
    'self/accounts/member/history',
    merge({
      fields: [
        'id',
        'transactionNumber',
        'date',
        'description',
        'amount',
        'type',
        'relatedAccount'
      ],
      pageSize: PAGE_SIZE
    },
    additionalParams ? additionalParams : {}),
    dispatch,
    successCriteria)
