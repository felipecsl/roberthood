import helpers from '../../../helpers'

function instrumentIdFromPosition(position) {
  return position.instrument
    .replace("https://api.robinhood.com/instruments/", "")
    .replace("/", "")
}

function filterByCategory(request$, category) {
  return request$.flatMap(x => x)
    .filter(res => res.request.category === category)
}

const user$ = (request$, state$) => filterByCategory(request$, 'user')
  .map(res => res.body)
  .flatMap(res => state$.take(1).map((state) => {
    state.user = res
    return state
  }))

const accounts$ = (request$, state$) => filterByCategory(request$, 'account')
  .map(res => res.body.results[0])
  .flatMap(res => state$.take(1).map((state) => {
    state.account = res
    return state
  }))

const portfolio$ = (request$, state$) => filterByCategory(request$, 'portfolio')
  .map(res => res.body)
  .flatMap(res => state$.take(1).map((state) => {
    state.portfolio = res
    return state
  }))

const historicals$ = (request$, state$) => filterByCategory(request$, 'historicals')
  .map(res => res.body.equity_historicals)
  .flatMap(res => state$.take(1).map((state) => {
    state.historicals = res
    state.historicals.adjusted_equity_previous_close =
      state.portfolio.adjusted_equity_previous_close
    return state
  }))

const positions$ = (request$, state$) => filterByCategory(request$, 'positions')
  .map(res => res.body.results)
  .map(results => results.map(pos => {
    pos.instrumentId = instrumentIdFromPosition(pos)
    return pos
  }))
  .flatMap(res => state$.take(1).map((state) => {
    state.positions = res
    return state
  }))

const instruments$ = (request$, state$) => filterByCategory(request$, 'instruments')
  .flatMap(res => state$.take(1).map((state) => {
    let position = state.positions.find(p => p.instrumentId === res.request.instrumentId)
    position.instrument = res.body
    return state
  }))

const quotes$ = (request$, state$) => filterByCategory(request$, 'quotes')
  .map(res => res.body.results)
  .flatMap(res => state$.take(1).map((state) => {
    res.forEach(quote => {
      let position = state.positions.find(p => p.instrument.symbol === quote.symbol)
      position.instrument.quote = quote
    })
    return state
  }))

const quoteHistoricals$ = (request$, state$) => filterByCategory(request$, 'quoteHistorical')
  .map(res => res.body)
  .flatMap(res => state$.take(1).map((state) => {
    let position = state.positions.find(p => p.instrument.symbol === res.symbol)
    position.historicals = res.historicals
    return state
  }))

export default {user$, accounts$, portfolio$, historicals$, positions$, instruments$, quotes$,
  quoteHistoricals$}
