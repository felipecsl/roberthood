import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'
import requests from './portfolio-requests'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const model$ = model(sources.HTTP, state$)
  const view$ = view(model$, sources.router)
  const requests$ = requests(model$)
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
  return {
    DOM: view$,
    HTTP: requests$,
    state$: model$,
    historicalData: Observable.merge(historicalsData$, quoteHistoricalData$)
  }
}

export default Portfolio
