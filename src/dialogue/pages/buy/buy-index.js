import {Observable} from 'rx'
import view from './buy-view'
import intent from './buy-intent'
import model from './buy-model'

const Buy = (sources) => {
  const {state$, props$, router} = sources
  const action$ = intent(sources)
  const model$ = model(state$, props$)
  const view$ = view(model$, action$, router)

  return {
    DOM: view$,
    HTTP: Observable.empty(),
    state$: model$,
    historicalData: sources.historicalData
  }
}

export default Buy
