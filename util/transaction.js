import dateFormat from 'dateformat'
import _ from 'lodash'
import { isSameMonth, monthRange } from './date'
import { ListView } from 'react-native'

export const sortTransactions = transactions =>
  _(transactions)
    .sortBy([tr => new Date(tr.date)])
    .reverse()
    .value()

export const filterTransactions = (transactions, selectedMonth) =>
  transactions.filter(tr => isSameMonth(tr.date, selectedMonth))

export const calculateMonthlyTotalSpent = (sortedTransactions) => {

  const lastTransactionDate = sortedTransactions.length > 0
    ? new Date(_.last(sortedTransactions).date)
    : new Date()

  const allMonths = monthRange(lastTransactionDate, new Date())
  const totals = allMonths.map(month => ({
    month,
    total: 0
  }))

  sortedTransactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date)
    const total = totals.find(total => isSameMonth(total.month, transactionDate))
    // Only interested in money spent, not received - hence Math.min
    total.total += Math.min(Number(transaction.amount), 0)
  })

  return totals
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

export const findTransactionsByDate = (transactions, date) =>
  typeof date === 'string'
  ? transactions
    .filter(tr => tr.date === date)
    .map(tr => tr.id)
  : []

export const buildDataSourceForTransactions = (transactions, datasource) => {
  const sortedTransactions = sortTransactions(transactions)
  const group = groupTransactionsByDate(sortedTransactions, 'mmmm yyyy', true)
  if (datasource) {
    return datasource.cloneWithRowsAndSections(group.groups, group.groupOrder)
  }
  const dataSource = new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber || a.selected !== b.selected,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
  return dataSource.cloneWithRowsAndSections(group.groups, group.groupOrder)
}
