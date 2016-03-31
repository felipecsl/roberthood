import {Observable} from 'rx'
import view from './positions-view'
import model from './positions-model'

const Positions = (sources) => {
  const state$ = sources.state$
  const model$ = model(sources.props$)
  const view$ = view(model$, sources.router)
  return {
    DOM: view$,
    HTTP: Observable.empty(),
    state$: model$,
    historicalData: Observable.empty()
  }
}


export default Positions
