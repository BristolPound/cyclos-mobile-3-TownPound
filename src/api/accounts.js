import { get, getPages } from './api'
import merge from '../util/merge'

const PAGE_SIZE = 50

export const getAccountBalance = (dispatch) =>
  get('self/accounts', {
    fields: ['status.balance'],
    requiresAuthorisation: true
  },
  dispatch)

export const getTransactions = (dispatch, additionalParams, successCriteria) =>
  getPages({
    pageSize: PAGE_SIZE,
    url: 'self/accounts/member/history',
    params: merge({
        fields: [
          'id',
          'transactionNumber',
          'date',
          'description',
          'amount',
          'type',
          'relatedAccount'
        ],
        pageSize: PAGE_SIZE,
        requiresAuthorisation: true
      },
      additionalParams ? additionalParams : {}),
    dispatch,
    successCriteria
  })
