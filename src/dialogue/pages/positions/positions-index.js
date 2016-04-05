import {Observable} from 'rx'
import view from './positions-view'
import model from './positions-model'

const Positions = (sources) => {
  const {state$, props$} = sources
  const model$ = model(state$, props$)
  const view$ = view(model$, sources.router)
  const historicalData$ = model$.take(1)
    .map(state => state.positions.find(p => p.instrument.symbol == state.currentInstrument))
    .map(p => ({
      data$: Observable.just(p.intradayHistoricals),
      prevClose: p.instrument.quote.previous_close,
      selector: '.chart-placeholder',
      width: 480,
      height: 250
    }))

  return {
    DOM: view$,
    HTTP: Observable.empty(),
    state$: model$,
    historicalData: historicalData$
  }
}


export default Positions
