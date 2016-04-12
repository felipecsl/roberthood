import HistoricalData from './historical-data'

export default class QuoteHistoricalData extends HistoricalData {
  data(rawData, interval, instrument) {
    return ({
      data: this.dataPoints(rawData, interval),
      prevClose: instrument.quote.previous_close,
      displayPrevClose: super.displayPrevClose(interval),
      selector: `.quote-${instrument.symbol}-chart-placeholder`,
      width: 120,
      height: 40
    })
  }

  dataPoints(rawData, interval) {
    return super.filterDataByInterval(rawData, interval)
  }
}
