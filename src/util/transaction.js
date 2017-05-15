import dateFormat from 'dateformat'
import _ from 'lodash'
import { isSameMonth, monthRange } from './date'
import { ListView } from 'react-native'

export const sortTransactions = transactions =>
  _(transactions)
    .sortBy([tr => new Date(tr.date)])
    .reverse()
    .value()

export const calculateMonthlyTotalSpent = (sortedTransactions) => {

  const lastTransactionDate = sortedTransactions.length > 0
    ? new Date(_.last(sortedTransactions).date)
    : new Date()

  const allMonths = monthRange(lastTransactionDate, new Date())

  const monthlySpendings = allMonths.map(month => ({
    month,
    total: 0,
    transactions: []
  }))
  sortedTransactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date)
    const monthToUpdate = monthlySpendings.find(total => isSameMonth(total.month, transactionDate))
    // Only interested in money spent, not received - hence Math.min
    monthToUpdate.transactions.push(transaction)
    monthToUpdate.total += Math.min(Number(transaction.amount), 0)
  })
  _.map(monthlySpendings, (total) => {total.transactions = groupTransactionsByDate(total.transactions)})
  return _.takeRight(monthlySpendings, 12)
}

const groupTransactionsByDate = (transactions, formatString='mmmm dS, yyyy', toUpper=false) => {
  const groups = _.groupBy(transactions, tr => {
    const groupTitle = dateFormat(new Date(tr.date), formatString)
    return toUpper ? groupTitle.toUpperCase() : groupTitle
  })
  return { groups, groupOrder: _.keys(groups) }
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
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
  return dataSource.cloneWithRowsAndSections(group.groups, group.groupOrder)
}
