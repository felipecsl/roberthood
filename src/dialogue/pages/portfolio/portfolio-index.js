import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'
import helpers from './helpers'
import requests from './requests'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const model$ = model(sources.HTTP, state$)
  const view$ = view(model$)
  const account$ = model$.filter(m => m.token !== undefined)
    .take(1).flatMap(requests.account$)
  const portfolio$ = model$.filter(m => m.account !== undefined)
    .take(1).flatMap(requests.portfolio$)
  const instruments$ = model$.filter(m => m.positions !== undefined)
    .take(1).flatMap(requests.instruments$$)
  const quotes$ = model$.filter(m => m.positions !== undefined)
    .filter(m => m.positions.every(p => p.instrument.symbol !== undefined))
    .take(1).flatMap(requests.quotes$)
  const historicals$ = model$.filter(m => helpers.isFullyLoaded(m))
    .take(1).flatMap(requests.historicals$)
  const historicalsData$ = model$.filter(m => m.historicals !== undefined)
    .take(1).map(state => state.historicals)

  return {
    DOM: view$,
    HTTP: Observable.merge(
      account$, portfolio$, instruments$, quotes$, historicals$),
    state$: model$,
    historicalData: historicalsData$
  }
}

export default Portfolio
