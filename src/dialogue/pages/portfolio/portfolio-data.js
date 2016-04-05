import {Observable} from 'rx'
import moment from 'moment'

const data$ = (model$, dataInterval$) => {
  /** Returns a Moment (date) object that represents the provided Interval String */
  const intervalStrToMoment = (str) => {
    if (str === '1D') {
      return moment().subtract(1, 'day')
    }
    if (str === '1M') {
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
  const filterDataByInterval = (dataArray, intervalStr) =>
    Observable.just(dataArray.filter(h => moment(h.begins_at) > intervalStrToMoment(intervalStr)))

  /**
   * Map a data interval String (1D, 1M, etc.) and *portfolio* historical data from the API into an
   * Object that can be passed into D3 in order to be displayed as a chart in an SVG. Filters the
   * input data by only returning the entries that happen after the interval cut date. Eg.: 3M
   * skips data that is older than 3 months.
   *
   * Params: i: String (interval), d: Array (raw data)
   */
  const transformPortfolioDataWithInterval = (i, d) => ({
    data$: filterDataByInterval(d, i),
    equityPrevClose: d.adjusted_equity_previous_close,
    displayPrevClose: displayPrevClose(i),
    selector: '.chart-placeholder',
    width: 480,
    height: 250
  })

  /**
   * Map a data interval String (1D, 1M, etc.) and portfolio Array of positions into an
   * Object that can be passed into D3 in order to be displayed as a chart in an SVG. Filters the
   * input data by only returning the entries that happen after the interval cut date. Eg.: 3M
   * skips data that is older than 3 months.
   *
   * Params: i: String (interval), p: Array (portfolio positions)
   */
  const transformIntradayQuoteDataWithInterval = (i, p) => p.map(p => ({
    data$: filterDataByInterval(p.intradayHistoricals, i),
    prevClose: p.instrument.quote.previous_close,
    displayPrevClose: true,
    selector: `.quote-${p.instrument.symbol}-chart-placeholder`,
    width: 120,
    height: 40
  }))

  const transformDailyQuoteDataWithInterval = (i, p) => p.map(p => ({
    data$: filterDataByInterval(p.dailyHistoricals, i),
    prevClose: p.instrument.quote.previous_close,
    displayPrevClose: false,
    selector: `.quote-${p.instrument.symbol}-chart-placeholder`,
    width: 120,
    height: 40
  }))

  /** Returns whether the previous market close should be displayed for the provided interval */
  const displayPrevClose = (str) => str === '1D'

  const portfolioIntradayHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i === '1D'),
    model$.filter(m => m.intradayHistoricals !== undefined).map(state => state.intradayHistoricals),
    transformPortfolioDataWithInterval)

  const portfolioDailyHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i !== '1D'),
    model$.filter(m => m.dailyHistoricals !== undefined).map(state => state.dailyHistoricals),
    transformPortfolioDataWithInterval)

  const quoteIntradayHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i === '1D'),
    model$.filter(m => m.positions !== undefined)
      .filter(m => m.positions.every(p => p.intradayHistoricals !== undefined))
      .map(m => m.positions),
    transformIntradayQuoteDataWithInterval).flatMap(x => x)

  const quoteDailyHistoricalData$ = Observable.combineLatest(
    dataInterval$.filter(i => i !== '1D'),
    model$.filter(m => m.positions !== undefined)
      .filter(m => m.positions.every(p => p.dailyHistoricals !== undefined))
      .map(m => m.positions),
    transformDailyQuoteDataWithInterval).flatMap(x => x)

  return Observable.merge(
    quoteIntradayHistoricalData$,
    quoteDailyHistoricalData$,
    portfolioIntradayHistoricalData$,
    portfolioDailyHistoricalData$,)
}

export default data$
