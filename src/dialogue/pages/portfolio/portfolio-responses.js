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

const portfolioIntradayHistoricals$ = (request$, state$) => filterByCategory(request$, 'historicals')
  .filter(res => res.request.span === 'day')
  .map(res => res.body.equity_historicals)
  .flatMap(res => state$.take(1).map((state) => {
    state.intradayHistoricals = res
    state.intradayHistoricals.adjusted_equity_previous_close =
      state.portfolio.adjusted_equity_previous_close
    return state
  }))

const portfolioDailyHistoricals$ = (request$, state$) => filterByCategory(request$, 'historicals')
  .filter(res => res.request.span === 'year')
  .map(res => res.body.equity_historicals)
  .flatMap(res => state$.take(1).map((state) => {
    state.dailyHistoricals = res
    // TODO: This is awkward: We're assigning a property to an Array type. This is likely gonna
    // cause problems. Need to fix this.
    state.dailyHistoricals.adjusted_equity_previous_close =
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

const quoteIntradayHistoricals$ = (request$, state$) => filterByCategory(request$, 'quoteHistorical')
  .filter(res => res.request.span === 'day')
  .map(res => res.body)
  .flatMap(res => state$.take(1).map((state) => {
    let position = state.positions.find(p => p.instrument.symbol === res.symbol)
    position.intradayHistoricals = res.historicals
    return state
  }))

const quoteDailyHistoricals$ = (request$, state$) => filterByCategory(request$, 'quoteHistorical')
  .filter(res => res.request.span === 'year')
  .map(res => res.body)
  .flatMap(res => state$.take(1).map((state) => {
    let position = state.positions.find(p => p.instrument.symbol === res.symbol)
    position.dailyHistoricals = res.historicals
    return state
  }))

export default {
  user$,
  accounts$,
  portfolio$,
  portfolioIntradayHistoricals$,
  portfolioDailyHistoricals$,
  positions$,
  instruments$,
  quotes$,
  quoteIntradayHistoricals$,
  quoteDailyHistoricals$
}
