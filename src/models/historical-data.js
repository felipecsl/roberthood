import moment from 'moment'

export default class HistoricalData {
  constructor(rawData, interval) {
    this.rawData = rawData;
    this.interval = interval;
  }

  /** Returns whether the previous market close should be displayed for the provided interval */
  displayPrevClose(str) {
    return this.interval === '1D'
  }

  /** Returns a Moment (date) object that represents the provided Interval String */
  intervalStrToMoment() {
    const str = this.interval
    if (str === '1D' || str === '1M') {
      return moment().subtract(1, 'month').add(1, 'day')
    }
    if (str === '3M') {
      return moment().subtract(3, 'month').add(1, 'day')
    }
    if (str === '6M') {
      return moment().subtract(6, 'month').add(1, 'day')
    }
    if (str === '1Y') {
      return moment().subtract(1, 'year').add(1, 'day')
    }
    if (str === 'ALL') {
      return moment().subtract(5, 'year').add(1, 'day')
    }
    return '1D'
  }

  /** Filters the provided data Array by skipping entries older than the provided interval date */
  filterDataByInterval(data = this.rawData) {
    return data.filter(h => moment(h.begins_at) > this.intervalStrToMoment())
  }

  isIntradayInterval() {
    return this.interval === '1D'
  }
}
