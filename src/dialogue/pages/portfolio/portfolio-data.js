import {Observable} from 'rx'

const data$ = (model$) => {
  const historicalsData$ = Observable.just(({
      data$: model$.filter(m => m.historicals !== undefined)
        .take(1).map(state => state.historicals),
      selector: '.chart-placeholder',
      width: 480,
      height: 250
    }))
  const quoteHistoricalData$ = model$.filter(m => m.positions !== undefined)
    .filter(m => m.positions.every(p => p.historicals !== undefined))
    .take(1).flatMap(state => state.positions.map(p => ({
      data$: Observable.just(p.historicals),
      selector: `.quote-${p.instrument.symbol}-chart-placeholder`,
      prevClose: p.instrument.quote.previous_close,
      width: 120,
      height: 40
    })))

  return Observable.merge(historicalsData$, quoteHistoricalData$)
}

export default data$
