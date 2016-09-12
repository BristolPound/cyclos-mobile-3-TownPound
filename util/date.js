// Util to deal with date including the {month, year} object used for transaction view

export const getNextMonth = date => {
  const nextMonth = (date.month + 1) % 12
  return {
    month: nextMonth,
    year: nextMonth === 0 ? date.year + 1 : date.year,
  }
}

export const getPreviousMonth = date => {
  const prevMonth = (date.month + 11) % 12
  return {
    month: prevMonth,
    year: prevMonth === 11 ? date.year - 1 : date.year,
  }
}
