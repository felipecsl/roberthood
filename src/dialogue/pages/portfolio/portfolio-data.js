import {Observable} from 'rx'
import moment from 'moment'

const data$ = (model$, dataInterval$) => {
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
  // Previous close only makes sense for daily
  const displayPrevClose = (str) => str === '1D'
  const historicalsData$ = Observable.combineLatest(dataInterval$,
    model$.filter(m => m.historicals !== undefined).map(state => state.historicals),
    (i, d) => ({
      data$: Observable.just(d.filter(h => moment(h.begins_at) > intervalStrToMoment(i))),
      equityPrevClose: d.adjusted_equity_previous_close,
      displayPrevClose: displayPrevClose(i),
      selector: '.chart-placeholder',
      width: 480,
      height: 250
    }))
  const quoteHistoricalData$ = Observable.combineLatest(dataInterval$,
    model$.filter(m => m.positions !== undefined)
      .filter(m => m.positions.every(p => p.historicals !== undefined))
      .map(m => m.positions),
    (i, positions) => positions.map(p => ({
      data$: Observable.just(
        p.historicals.filter(h => moment(h.begins_at) > intervalStrToMoment(i))),
      selector: `.quote-${p.instrument.symbol}-chart-placeholder`,
      prevClose: p.instrument.quote.previous_close,
      displayPrevClose: displayPrevClose(i),
      width: 120,
      height: 40
    }))).flatMap(x => x)

  return Observable.merge(historicalsData$, quoteHistoricalData$)
}

export default data$
