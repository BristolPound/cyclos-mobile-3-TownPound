import { get, post } from './api'

export const makePayment = (payment, dispatch) =>
  get('self/payments/data-for-perform', {
      to: payment.subject,
      fields: 'paymentTypes.id'
  }, dispatch)
  .then(json => post('self/payments', {
      ...payment,
      type: json.paymentTypes[0].id
    }, dispatch))
