import {instrumentIdFromUrl} from '../../../helpers'
import logger from '../../../logger'

function filterByCategory(request$, category) {
  return request$.flatMap(x => x)
    .filter(res => res.request.category === category)
}

const user$ = (request$, state$) => filterByCategory(request$, 'user')
  .map(res => res.body)
  .withLatestFrom(state$, (res, state) => {
    state.user = res
    logger.log("PORTFOLIO RESPONSES - user:", state)
    return state
  })
  .share()

const accounts$ = (request$, state$) => filterByCategory(request$, 'account')
  .map(res => res.body.results[0])
  .withLatestFrom(state$, (res, state) => {
    logger.log("PORTFOLIO RESPONSES - account:", state)
    state.account = res
    return state
  })
  .share()

const portfolio$ = (request$, state$) => filterByCategory(request$, 'portfolio')
  .map(res => res.body)
  .withLatestFrom(state$, (res, state) => {
    state.portfolio = res
    return state
  })
  .share()

const portfolioIntradayHistoricals$ = (request$, state$) => filterByCategory(request$, 'historicals')
  .filter(res => res.request.span === 'day')
  .map(res => res.body.equity_historicals)
  .flatMap(res => state$.take(1).map((state) => {
    state.portfolio.intradayHistoricals = res
    return state
  }))
  .share()

const portfolioDailyHistoricals$ = (request$, state$) => filterByCategory(request$, 'historicals')
  .filter(res => res.request.span === 'year')
  .map(res => res.body.equity_historicals)
  .flatMap(res => state$.take(1).map((state) => {
    state.portfolio.dailyHistoricals = res
    return state
  }))
  .share()

const positions$ = (request$, state$) => filterByCategory(request$, 'positions')
  .map(res => res.body.results)
  .map(results => results.map(pos => {
    pos.instrumentId = instrumentIdFromUrl(pos.instrument)
    return pos
  }))
  .flatMap(res => state$.take(1).map((state) => {
    state.positions = res
    return state
  }))
  .share()

const instruments$ = (request$, state$) => filterByCategory(request$, 'instruments')
  .flatMap(res => state$.take(1).map((state) => {
    let position = state.positions.find(p => p.instrumentId === res.request.instrumentId)
    position.instrument = res.body
    return state
  }))
  .share()

const quotes$ = (request$, state$) => filterByCategory(request$, 'quotes')
  .map(res => res.body.results)
  .flatMap(res => state$.take(1).map((state) => {
    res.forEach(quote => {
      let position = state.positions.find(p => p.instrument.symbol === quote.symbol)
      position.instrument.quote = quote
    })
    return state
  }))
  .share()

const quoteIntradayHistoricals$ = (request$, state$) => filterByCategory(request$, 'quoteHistorical')
  .filter(res => res.request.span === 'day')
  .map(res => res.body)
  .flatMap(res => state$.take(1).map((state) => {
    let position = state.positions.find(p => p.instrument.symbol === res.symbol)
    position.intradayHistoricals = res.historicals
    return state
  }))
  .share()

const quoteDailyHistoricals$ = (request$, state$) => filterByCategory(request$, 'quoteHistorical')
  .filter(res => res.request.span === 'year')
  .map(res => res.body)
  .flatMap(res => state$.take(1).map((state) => {
    let position = state.positions.find(p => p.instrument.symbol === res.symbol)
    position.dailyHistoricals = res.historicals
    return state
  }))
  .share()

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
