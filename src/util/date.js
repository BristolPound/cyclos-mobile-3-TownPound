import moment from 'moment'
import _ from 'lodash'

export const isSameMonth = (a, b) =>  moment(a).isSame(moment(b), 'month')

export const format = (mmt, format = 'YYYY-MM') => moment(mmt).format(format)


// Returns a list of moments - the floored (i.e. round to the start of the month) date
//                             between the floored start and floored end.
export const monthRange = (start, end) => {
  const startMonth = moment(start).startOf('month')
  const endMonth = moment(end).startOf('month')
  let monthDiff = endMonth.diff(startMonth, 'months') + 1

  return _(monthDiff)
            .range()
            .map(md => moment(startMonth).add(md, 'months').toDate())
            .value()
}
