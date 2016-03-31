import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'
import helpers from './helpers'
import requests from './requests'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const model$ = model(sources.HTTP, state$)
  const view$ = view(model$, sources.router)
  const account$ = model$.filter(m => m.token !== undefined)
    .take(1).flatMap(requests.account$)
  const portfolio$ = model$.filter(m => m.account !== undefined)
    .take(1).flatMap(requests.portfolio$)
  const instruments$ = model$.filter(m => m.positions !== undefined)
    .take(1).flatMap(requests.instruments$$)
  const quotes$ = model$.filter(m => m.positions !== undefined)
    .filter(m => m.positions.every(p => p.instrument.symbol !== undefined))
    .take(1).flatMap(requests.quotes$)
  const quotesHistoricals$ = model$.filter(m => m.positions !== undefined)
    .filter(m => m.positions.every(p => p.instrument.symbol !== undefined))
    .take(1).flatMap(requests.quotesHistoricals$)
  const historicals$ = model$.filter(m => helpers.isFullyLoaded(m))
    .take(1).flatMap(requests.historicals$)
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
    HTTP: Observable.merge(account$, portfolio$, instruments$, quotes$, quotesHistoricals$,
      historicals$),
    state$: model$,
    historicalData: Observable.merge(historicalsData$, quoteHistoricalData$)
  }
}

export default Portfolio
