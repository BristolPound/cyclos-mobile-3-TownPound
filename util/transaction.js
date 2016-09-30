import dateFormat from 'dateformat'
import _ from 'lodash'
import merge from './merge'
import { floorMonth, convert, isSameMonth, format } from './date'

export const sortTransactions = transactions =>
  _(transactions)
    .sortBy([tr => convert.fromString(tr.date), tr => tr.relatedAccount.user ? tr.relatedAccount.user.display : undefined])
    .reverse()
    .value()

export const filterTransactions = (transactions, selectedMonth) =>
  transactions.filter(tr => isSameMonth(tr.date, selectedMonth))

export const calculateMonthlyTotalSpent = (monthlyTotals, newTransactions) => {
  let newMonthlyTotals = merge(monthlyTotals)
  let filtered = newTransactions.filter(tr => Number(tr.amount) < 0)
  let grouped = _.groupBy(filtered, tr => format(floorMonth(convert.fromString(tr.date))))

  _.keys(grouped).forEach(k => {
    if (!(k in newMonthlyTotals)) {
      newMonthlyTotals[k] = 0
    }
    newMonthlyTotals[k] += _.sumBy(grouped[k], tr => Number(tr.amount))
  })

  return newMonthlyTotals
}

export const groupTransactionsByDate = (transactions, formatString='mmmm dS, yyyy', toUpper=false) => {
  const groups = _.groupBy(transactions, tr => {
    const groupTitle = dateFormat(new Date(tr.date), formatString)
    return toUpper ? groupTitle.toUpperCase() : groupTitle
  })
  return { groups, groupOrder: _.keys(groups) }
}

export const groupTransactionsByBusiness = transactions => {
  let filtered = transactions.filter(tr => Number(tr.amount) < 0 && tr.relatedAccount.user)
  let grouped = _.groupBy(filtered, tr => tr.relatedAccount.user.id)

  let results = _.keys(grouped).map(k => {
    let account = grouped[k][0].relatedAccount
    return {
      id: account.user.id,
      relatedAccount: account,
      amount: _.sumBy(grouped[k], tr => Number(tr.amount))
    }
  })

  return _.sortBy(results, ['amount', 'relatedAccount.user.display'])
}

//TODO: optimise as this is currently only used to find transactions at the start or end of the list
export const findTransactionsByDate = (transactions, date) =>
  typeof date === 'string'
  ? transactions
    .filter(tr => tr.date === date)
    .map(tr => tr.id)
  : []
