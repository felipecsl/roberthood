import {Observable} from 'rx'
import moment from 'moment'
import EquityHistoricalData from '../../../models/equity-historical-data'
import QuoteHistoricalData from '../../../models/quote-historical-data'

const data$ = (model$, dataInterval$) => {
  const portfolioIntradayHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i === '1D'),
    model$.filter(m => m.intradayHistoricals !== undefined).map(state => state.intradayHistoricals),
    (i, d) => new EquityHistoricalData().data(d, i))

  const portfolioDailyHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i !== '1D'),
    model$.filter(m => m.dailyHistoricals !== undefined).map(state => state.dailyHistoricals),
    (i, d) => new EquityHistoricalData().data(d, i))

  return Observable.merge(
    QuoteHistoricalData.stream$(model$, dataInterval$),
    portfolioIntradayHistoricalData$,
    portfolioDailyHistoricalData$,)
}

export default data$
