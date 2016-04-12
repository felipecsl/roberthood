import moment from 'moment'

export default class HistoricalData {
  /** Returns whether the previous market close should be displayed for the provided interval */
  displayPrevClose(str) {
    return str === '1D'
  }

  /** Returns a Moment (date) object that represents the provided Interval String */
  intervalStrToMoment(str) {
    if (str === '1D' || str === '1M') {
      return moment().subtract(1, 'month')
    }
    if (str == '3M') {
      return moment().subtract(3, 'month')
    }
    if (str == '6M') {
      return moment().subtract(6, 'month')
    }
    if (str == '1Y') {
      return moment().subtract(1, 'year')
    }
  }

  /** Filters the provided data Array by skipping entries older than the provided interval date */
  filterDataByInterval(dataArray, intervalStr) {
    return dataArray.filter(h => moment(h.begins_at) > this.intervalStrToMoment(intervalStr))
  }

  constructor() {
  }
}
