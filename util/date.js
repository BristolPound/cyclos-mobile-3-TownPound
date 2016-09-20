import moment from 'moment'
import _ from 'lodash'

export const currentMonth = () => moment().startOf('month')

export const floorMonth = mmt => moment(mmt).startOf('month')

export const previousMonth = mmt => moment(mmt).subtract(1, 'months')

const isCurrentMonth = mmt =>  moment().isSame(mmt, 'month')

export const isSameMonth = (a, b) =>  moment(a).isSame(b, 'month')

export const compare = (a, b) =>
  moment(a).isBefore(b) ? -1 : (moment(a).isSame(b) ? 0 : 1)

export const toMonthString = mmt =>
  isCurrentMonth(mmt) ? 'Spent This Month' : moment(mmt).format('MMMM')

export const format = (mmt, format = 'YYYY-MM') =>
  moment(mmt).format(format)

export const convert = {
  fromString: (s, format = undefined) => moment(s, format),
  stringToJson: s => (new Date(s)).toJSON()
}

// Returns a list of moments - the floored (i.e. round to the start of the month) date
//                             between the floored start and floored end.
export const monthRange = (start, end) => {
  const startMonth = floorMonth(start)
  const endMonth = floorMonth(end)
  let monthDiff = endMonth.diff(startMonth, 'months') + 1

  return _(monthDiff)
            .range()
            .map(md => moment(startMonth).add(md, 'months'))
            .value()
}
