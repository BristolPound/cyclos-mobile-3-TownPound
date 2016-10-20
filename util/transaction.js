import dateFormat from 'dateformat'
import _ from 'lodash'
import merge from './merge'
import { floorMonth, convert, isSameMonth, format } from './date'
import { ListView } from 'react-native'

export const sortTransactions = transactions =>
  _(transactions)
    .sortBy([tr => convert.fromString(tr.date), tr => tr.relatedAccount.user ? tr.relatedAccount.user.display : undefined])
    .reverse()
    .value()

export const filterTransactions = (transactions, selectedMonth) =>
  transactions.filter(tr => isSameMonth(tr.date, selectedMonth))

export const calculateMonthlyTotalSpent = (transactions) => {
  let monthlyTotals = []
  transactions.forEach(tr => {
    const amount = Number(tr.amount)
    if (amount < 0) {
      const month = format(floorMonth(convert.fromString(tr.date)))
      if (!(month in monthlyTotals)) {
        monthlyTotals[month] = 0
      }
      monthlyTotals[month] += Number(tr.amount)
    }
  })
  return monthlyTotals
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

export const buildDataSourceForTransactions = (transactions) => {
  const sortedTransactions = sortTransactions(transactions)
  const group = groupTransactionsByDate(sortedTransactions, 'mmmm yyyy', true)
  const dataSource = new ListView.DataSource({
    rowHasChanged: (a, b) => a.transactionNumber !== b.transactionNumber,
    sectionHeaderHasChanged: (a, b) => a !== b
  })
  return dataSource.cloneWithRowsAndSections(group.groups, group.groupOrder)
}
