import {Observable} from 'rx'

function instrumentIdFromPosition(position) {
  return position.instrument
    .replace("https://api.robinhood.com/instruments/", "")
    .replace("/", "")
}

function filterRequestByCategory(request$, category) {
  return request$.flatMap(x => x)
    .filter(res => res.request.category === category)
}

const portfolioModel = (request$, state$) => {
  const user$ = filterRequestByCategory(request$, 'user')
      .map(res => res.body)
      .flatMap(res => state$.take(1).map((state) => {
        state.user = res
        return state
      }))
  const accounts$ = filterRequestByCategory(request$, 'account')
      .map(res => res.body.results[0])
      .flatMap(res => state$.take(1).map((state) => {
        state.account = res
        return state
      }))
  const portfolio$ = filterRequestByCategory(request$, 'portfolio')
      .map(res => res.body)
      .flatMap(res => state$.take(1).map((state) => {
        state.portfolio = res
        return state
      }))
  const historicals$ = filterRequestByCategory(request$, 'historicals')
      .map(res => res.body.equity_historicals)
      .flatMap(res => state$.take(1).map((state) => {
        state.historicals = res
        return state
      }))
  const positions$ = filterRequestByCategory(request$, 'positions')
      .map(res => res.body.results)
      .map(results => results.map(pos => {
        pos.instrumentId = instrumentIdFromPosition(pos)
        return pos
      }))
      .flatMap(res => state$.take(1).map((state) => {
        state.positions = res
        return state
      }))
  const instruments$ = filterRequestByCategory(request$, 'instruments')
      .flatMap(res => state$.take(1).map((state) => {
        let position = state.positions
          .filter(p => p.instrumentId === res.request.instrumentId)
        position[0].instrument = res.body
        return state
      }))
  const quotes$ = filterRequestByCategory(request$, 'quotes')
      .map(res => res.body.results)
      .flatMap(res => state$.take(1).map((state) => {
        res.forEach(quote => {
          let position = state.positions
            .filter(p => p.instrument.symbol === quote.symbol)
          position[0].instrument.quote = quote
        })
        return state
      }))
  return Observable.merge(state$.take(1), user$, accounts$, portfolio$,
    historicals$, positions$, instruments$, quotes$)
}

export default portfolioModel
