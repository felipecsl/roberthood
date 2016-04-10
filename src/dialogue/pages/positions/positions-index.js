import {Observable} from 'rx'
import view from './positions-view'
import model from './positions-model'
import intent from './positions-intent'

const Positions = (sources) => {
  const {state$, props$, router, historicalData, DOM} = sources
  const dataInterval$ = intent(DOM)
  const model$ = model(state$, props$)
  const view$ = view(model$, dataInterval$, router)
  const historicalData$ = model$.take(1)
    .map(state => state.positions.find(p => p.instrument.symbol == state.currentInstrument))
    .map(p => ({
      data: p.intradayHistoricals,
      prevClose: p.instrument.quote.previous_close,
      selector: '.chart-placeholder',
      displayPrevClose: true,
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
