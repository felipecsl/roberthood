import HistoricalData from './historical-data'

export default class EquityHistoricalData extends HistoricalData {
  data(rawData, interval) {
    return ({
      data: this.dataPoints(rawData, interval),
      prevClose: rawData.adjusted_equity_previous_close,
      displayPrevClose: super.displayPrevClose(interval),
      selector: '.chart-placeholder',
      width: 480,
      height: 250
    })
  }

  dataPoints(rawData, interval) {
    return super.filterDataByInterval(rawData, interval).map(d => {
      d.open_price = d.adjusted_open_equity
      d.close_price = d.adjusted_close_equity
      return d
    })
  }
}
