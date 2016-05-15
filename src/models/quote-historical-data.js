import HistoricalData from './historical-data'
import { Observable } from 'rx'

export default class QuoteHistoricalData extends HistoricalData {
  /** Returns an Observable with a data stream for all instruments that are part of the portfolio */
  static stream$(model$, dataInterval$) {
    const filterPositions = (model$, filterFn) => model$.filter(m => m.positions !== undefined)
      .filter(m => m.positions.every(filterFn))
      .map(m => m.positions)

    const intraday$ = Observable.combineLatest(
      dataInterval$.filter(i => i === '1D'),
      filterPositions(model$, p => p.intradayHistoricals !== undefined),
      (i, p) => p.map(p => new QuoteHistoricalData(p.intradayHistoricals, i).data(p.instrument))
    ).flatMap(x => x)

    const daily$ = Observable.combineLatest(
      dataInterval$.filter(i => i !== '1D'),
      filterPositions(model$, p => p.dailyHistoricals !== undefined),
      (i, p) => p.map(p => new QuoteHistoricalData(p.dailyHistoricals, i).data(p.instrument))
    ).flatMap(x => x)

    return Observable.merge(intraday$, daily$)
  }

  /** Returns an Observable with a data stream for the currently selected instrument  */
  static streamCurrentInstrument$(model$, dataInterval$) {
    const filteredModel$ = model$.take(1)
      .map(state => state.positions.find(p => p.instrument.symbol === state.currentInstrument))

    const intraday$ = Observable.combineLatest(
      dataInterval$.filter(i => i === '1D'),
      filteredModel$,
      (i, p) => new QuoteHistoricalData(p.intradayHistoricals, i).data(p.instrument, 720, 300))

    const daily$ = Observable.combineLatest(
      dataInterval$.filter(i => i !== '1D'),
      filteredModel$,
      (i, p) => new QuoteHistoricalData(p.dailyHistoricals, i).data(p.instrument, 720, 300))

    return Observable.merge(intraday$, daily$)
  }

  percentChange() {
    const lastTradePrice = this.rawData.instrument.quote.last_trade_price
    return (this.absChange() / lastTradePrice) * 100
  }

  absChange() {
    const lastTradePrice = this.rawData.instrument.quote.last_trade_price
    if (super.isIntradayInterval()) {
      return lastTradePrice - this.rawData.instrument.quote.previous_close
    }
    const data = super.filterDataByInterval(this.rawData.dailyHistoricals)
    return lastTradePrice - data[0].open_price
  }

  data(instrument, width = 120, height = 40) {
    return ({
      data: this.dataPoints(),
      prevClose: instrument.quote.previous_close,
      displayPrevClose: super.displayPrevClose(),
      selector: `.quote-${instrument.symbol}-chart-placeholder`,
      width,
      height,
    })
  }

  dataPoints() {
    return super.filterDataByInterval()
  }
}
