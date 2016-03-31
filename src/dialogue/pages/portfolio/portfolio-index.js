import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'
import requests from './portfolio-requests'
import historicalData from './portfolio-data'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const model$ = model(sources.HTTP, state$)
  const view$ = view(model$, sources.router)
  const requests$ = requests(model$)
  const historicalData$ = historicalData(model$)
  return {
    DOM: view$,
    HTTP: requests$,
    state$: model$,
    historicalData: historicalData$
  }
}

export default Portfolio
