import {Observable} from 'rx'

export default (state$, response$$) => Observable.merge(
  state$.take(1),
  response$$.flatMap(x => x)
    .filter(res => res.request.category === 'orders')
    .map(res => res.body.results)
    .flatMap(res => state$.take(1).map((state) => {
      state.orders = res
      return state
    })),
  response$$.flatMap(x => x)
    .filter(res => res.request.category === 'orderInstrument')
    .flatMap(res => state$.take(1)
      .map(state => {
        const order = state.orders.find(o => o.id === res.request.orderId)
        order.instrument = res.body
        return state
      })))
