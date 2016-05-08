import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'
import requests from './portfolio-requests'
import intent from './portfolio-intent'
import data from './portfolio-data'
import logger from '../../../logger'

const Portfolio = (sources) => {
  logger.log('Portfolio#index')
  const dataInterval$ = intent(sources.DOM)
  const router = sources.router
  const http$ = sources.HTTP
  const state$ = sources.state$.do(s => logger.log('STATE updated with:', s))
  const globalActions$ = sources.globalActions$
  const model$ = model(globalActions$, http$, state$)
  const view$ = view(model$, dataInterval$, router)
  const requests$ = requests(model$)
  const data$ = data(model$, dataInterval$)

  return {
    DOM: view$,
    HTTP: requests$,
    state$: model$,
    historicalData: data$,
    globalActions$: Observable.empty()
  }
}

export default Portfolio
