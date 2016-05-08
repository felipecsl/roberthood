import view from './orders-view'
import model from './orders-model'
import requests from './orders-requests'

const Orders = (sources) => {
  const {state$} = sources
  const model$ = model(state$, sources.HTTP)
  const requests$ = requests(model$)
  const view$ = view(model$)

  return {
    DOM: view$,
    HTTP: requests$,
    state$: model$,
  }
}

export default Orders
