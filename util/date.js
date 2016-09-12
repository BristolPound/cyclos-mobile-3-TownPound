import moment from 'moment'

export const currentMonth = () => moment().startOf('month')

export const floorMonth = (mmt) => moment(mmt).startOf('month')

export const nextMonth = mmt => moment(mmt).add(1, 'months')

export const previousMonth = mmt => moment(mmt).subtract(1, 'months')

export const isCurrentMonth = mmt =>  moment().isSame(mmt, 'month')

export const isSameMonth = (a, b) =>  moment(a).isSame(b, 'month')

export const compare = (a, b) =>
  moment(a).isBefore(b) ? -1 : (moment(a).isSame(b) ? 0 : 1)

export const toMonthString = mmt =>
  isCurrentMonth(mmt) ? 'This Month' : moment(mmt).format('MMMM')

export const format = (mmt, format = 'YYYY-MM') =>
  moment(mmt).format(format)

export const convert = {
  fromDate: d => moment(d),
  toDate: m => m.toDate(),
  fromString: (s, format = undefined) => moment(s, format),
  stringToJson: s => (new Date(s)).toJSON()
}

// Returns a list of moments - the floored (i.e. round to the start of the month) date
//                             between the floored start and floored end.
export const monthRange = (start, end) => {
  const startMonth = floorMonth(start)
  const endMonth = floorMonth(end)
  if (compare(startMonth, end) > 0) {
    return []
  }
  let rangeList = [startMonth]
  let currentDate = nextMonth(startMonth)
  while (compare(currentDate, endMonth) <= 0) {
    rangeList.push(moment(currentDate))
    currentDate = nextMonth(currentDate)
  }
  return rangeList
}
