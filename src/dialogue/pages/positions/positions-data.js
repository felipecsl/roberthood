import {Observable} from 'rx'
import QuoteHistoricalData from '../../../models/quote-historical-data'

export default (model$, dataInterval$) => {
  const filteredModel$ = model$.take(1)
    .map(state => state.positions.find(p => p.instrument.symbol == state.currentInstrument))

  const intraday$ = Observable.combineLatest(
    dataInterval$.filter(i => i === '1D'),
    filteredModel$,
    (i, p) => new QuoteHistoricalData().data(p.intradayHistoricals, i, p.instrument, 480, 250))

  const daily$ = Observable.combineLatest(
    dataInterval$.filter(i => i !== '1D'),
    filteredModel$,
    (i, p) => new QuoteHistoricalData().data(p.dailyHistoricals, i, p.instrument, 480, 250))

  return Observable.merge(intraday$, daily$)
}
