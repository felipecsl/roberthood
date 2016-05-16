import { Observable } from 'rx'
import view from './graph-view'
import model from './graph-model'
import data from './graph-data'

const Graphs = (sources) => {
  const { state$, props$ } = sources
  const model$ = model(state$, props$)
  const view$ = view(model$)
  const historicalData$ = data(model$)

  return {
    DOM: view$,
    HTTP: Observable.empty(),
    state$: model$,
    historicalData: historicalData$,
  }
}

export default Graphs
