import {Observable} from 'rx'
import HistoricalData from './historical-data'

export default class EquityHistoricalData extends HistoricalData {
  /** Returns an Observable with a data stream for the portfolio equity */
  static stream$(model$, dataInterval$) {
    const intraday$ = Observable.combineLatest(
      dataInterval$.filter(i => i === '1D'),
      model$.filter(m => m.intradayHistoricals !== undefined).map(state => state.intradayHistoricals),
      (i, d) => new EquityHistoricalData(d, i).data())

    const daily$ = Observable.combineLatest(
      dataInterval$.filter(i => i !== '1D'),
      model$.filter(m => m.dailyHistoricals !== undefined).map(state => state.dailyHistoricals),
      (i, d) => new EquityHistoricalData(d, i).data())

    return Observable.merge(intraday$, daily$)
  }

  data() {
    return ({
      data: this.dataPoints(),
      prevClose: this.rawData.adjusted_equity_previous_close,
      displayPrevClose: super.displayPrevClose(),
      selector: '.chart-placeholder',
      width: 480,
      height: 250
    })
  }

  /** Returns the percent change for the portfolio equity in the provided time interval */
  percentChange() {
    const lastCoreEquity = this.rawData.portfolio.last_core_equity
    return (this.absChange() / lastCoreEquity) * 100
  }

  absChange() {
    const lastCoreEquity = this.rawData.portfolio.last_core_equity
    if (this.interval === '1D') {
      return lastCoreEquity - this.rawData.portfolio.adjusted_equity_previous_close
    } else {
      const data = super.filterDataByInterval(this.rawData.dailyHistoricals)
      return lastCoreEquity - data[0].adjusted_open_equity
    }
  }

  dataPoints() {
    return super.filterDataByInterval().map(d => {
      d.open_price = d.adjusted_open_equity
      d.close_price = d.adjusted_close_equity
      return d
    })
  }
}
