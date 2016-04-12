import HistoricalData from './historical-data'
import {Observable} from 'rx'

export default class QuoteHistoricalData extends HistoricalData {
  /** Returns an Observable with a data stream for all instruments that are part of the portfolio */
  static stream$(model$, dataInterval$) {
    const filterPositions = (model$, filterFn) => model$.filter(m => m.positions !== undefined)
      .filter(m => m.positions.every(filterFn))
      .map(m => m.positions)

    const intraday$ = Observable.combineLatest(
      dataInterval$.filter(i => i === '1D'),
      filterPositions(model$, p => p.intradayHistoricals !== undefined),
      (i, p) => p.map(p => new QuoteHistoricalData().data(p.intradayHistoricals, i, p.instrument))
    ).flatMap(x => x)

    const daily$ = Observable.combineLatest(
      dataInterval$.filter(i => i !== '1D'),
      filterPositions(model$, p => p.dailyHistoricals !== undefined),
      (i, p) => p.map(p => new QuoteHistoricalData().data(p.dailyHistoricals, i, p.instrument))
    ).flatMap(x => x)

    return Observable.merge(intraday$, daily$)
  }

  data(rawData, interval, instrument, width = 120, height = 40) {
    return ({
      data: this.dataPoints(rawData, interval),
      prevClose: instrument.quote.previous_close,
      displayPrevClose: super.displayPrevClose(interval),
      selector: `.quote-${instrument.symbol}-chart-placeholder`,
      width: width,
      height: height
    })
  }

  dataPoints(rawData, interval) {
    return super.filterDataByInterval(rawData, interval)
  }
}
