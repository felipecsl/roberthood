import {Observable} from 'rx'
import view from './orders-view'
import intent from './orders-intent'
import model from './orders-model'
import requests from './orders-requests'

const Orders = (sources) => {
  const {state$, router, historicalData} = sources
  const action$ = intent(sources)
  const model$ = model(state$, sources.HTTP)
  const requests$ = requests(model$)
  const view$ = view(model$)

  return {
    DOM: view$,
    HTTP: requests$,
    state$: model$,
    historicalData: historicalData
  }
}

export default Orders
