import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'
import requests from './portfolio-requests'
import intent from './portfolio-intent'
import historicalData from './portfolio-data'

const Portfolio = (sources) => {
  const dataInterval$ = intent(sources.DOM)
  const state$ = sources.state$
  const model$ = model(sources.HTTP, state$)
  const view$ = view(model$, dataInterval$, sources.router)
  const requests$ = requests(model$, dataInterval$)
  const historicalData$ = historicalData(model$, dataInterval$)
  return {
    DOM: view$,
    HTTP: requests$,
    state$: model$,
    historicalData: historicalData$
  }
}

export default Portfolio
