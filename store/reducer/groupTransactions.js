import dateFormat from 'dateformat'

const groupTransactions = (transactions) => {
  transactions = transactions.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
  let groups = {}
  let groupOrder = []
  transactions.forEach((transaction) => {
    const category = dateFormat(new Date(transaction.dateTime), 'mmmm dS, yyyy')
    if (groupOrder.indexOf(category) === -1) {
      groups[category] = []
      groupOrder.push(category)
    }
    groups[category].push(transaction)
  })
  return {groups, groupOrder}
}

export default groupTransactions
