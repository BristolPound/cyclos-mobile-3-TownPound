//TODO: optimise as this is currently only used to find transactions at the start or end of the list
export const findTransactionsByDate = (transactions, date) =>
  typeof date === 'string'
  ? transactions
    .filter(tr => tr.date === date)
    .map(tr => tr.id)
  : []
