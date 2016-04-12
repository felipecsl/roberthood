import {Observable} from 'rx'
import moment from 'moment'
import EquityHistoricalData from '../../../models/equity-historical-data'
import QuoteHistoricalData from '../../../models/quote-historical-data'

const data$ = (model$, dataInterval$) => {
  const filterPositions = (model$, filterFn) => model$.filter(m => m.positions !== undefined)
    .filter(m => m.positions.every(filterFn))
    .map(m => m.positions)

  const portfolioIntradayHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i === '1D'),
    model$.filter(m => m.intradayHistoricals !== undefined).map(state => state.intradayHistoricals),
    (i, d) => new EquityHistoricalData().data(d, i))

  const portfolioDailyHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i !== '1D'),
    model$.filter(m => m.dailyHistoricals !== undefined).map(state => state.dailyHistoricals),
    (i, d) => new EquityHistoricalData().data(d, i))

  const quoteIntradayHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i === '1D'),
    filterPositions(model$, p => p.intradayHistoricals !== undefined),
    (i, p) => p.map(p => new QuoteHistoricalData().data(p.intradayHistoricals, i, p.instrument))
  ).flatMap(x => x)

  const quoteDailyHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i !== '1D'),
    filterPositions(model$, p => p.dailyHistoricals !== undefined),
    (i, p) => p.map(p => new QuoteHistoricalData().data(p.dailyHistoricals, i, p.instrument))
  ).flatMap(x => x)

  return Observable.merge(
    quoteIntradayHistoricalData$,
    quoteDailyHistoricalData$,
    portfolioIntradayHistoricalData$,
    portfolioDailyHistoricalData$,)
}

export default data$
