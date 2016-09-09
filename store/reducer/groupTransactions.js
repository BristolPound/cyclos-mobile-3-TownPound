import dateFormat from 'dateformat'
import merge from '../../util/merge'
import { floorMonth, convert, compare, format } from '../../util/date'

export const sortTransactions = (transactions) => transactions.sort((a, b) => compare(convert.fromString(b.date), convert.fromString(a.date)))

export const calculateMonthlyTotalSpent = (monthlyTotals, newTransactions) => {
  let newMonthlyTotals = merge(monthlyTotals)
  newTransactions.forEach(tr => {
    const transactionAmount = Number(tr.amount)
    if (!isNaN(transactionAmount) && transactionAmount < 0) {
      const transactionMonth = format(floorMonth(convert.fromString(tr.date)))
      if (!(transactionMonth in newMonthlyTotals)) {
        newMonthlyTotals[transactionMonth] = 0
      }
      newMonthlyTotals[transactionMonth] += transactionAmount
    }
  })
  return newMonthlyTotals
}

const groupSortedTransactions = (transactions) => {
  let groups = {}
  let groupOrder = []
  transactions.forEach((transaction) => {
    const category = dateFormat(new Date(transaction.date), 'mmmm dS, yyyy')
    if (groupOrder.indexOf(category) === -1) {
      groups[category] = []
      groupOrder.push(category)
    }
    groups[category].push(transaction)
  })
  return {groups, groupOrder}
}

export default groupSortedTransactions
