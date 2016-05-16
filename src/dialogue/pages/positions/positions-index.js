import { Observable } from 'rx'
import view from './positions-view'
import model from './positions-model'
import intent from './positions-intent'
import data from './positions-data'

const Positions = (sources) => {
  const { state$, props$, router, DOM } = sources
  const dataInterval$ = intent(DOM)
  const model$ = model(state$, props$)
  const view$ = view(model$, dataInterval$, router)
  const historicalData$ = data(model$, dataInterval$)

  return {
    DOM: view$,
    HTTP: Observable.empty(),
    state$: model$,
    historicalData: historicalData$,
  }
}


export default Positions
