import { instrumentIdFromUrl } from '../../../helpers'
import logger from '../../../logger'

function filterByCategory(request$, category) {
  return request$.flatMap(x => x)
    .filter(res => res.request.category === category)
}

const user$ = (request$, state$) => filterByCategory(request$, 'user')
  .map(res => res.body)
  .withLatestFrom(state$, (res, state) => {
    const newState = state
    newState.user = res
    logger.log("PORTFOLIO RESPONSES - user:", state)
    return newState
  })
  .share()

const accounts$ = (request$, state$) => filterByCategory(request$, 'account')
  .map(res => res.body.results[0])
  .withLatestFrom(state$, (res, state) => {
    logger.log("PORTFOLIO RESPONSES - account:", state)
    const newState = state
    newState.account = res
    return newState
  })
  .share()

const portfolio$ = (request$, state$) => filterByCategory(request$, 'portfolio')
  .map(res => res.body)
  .withLatestFrom(state$, (res, state) => {
    const newState = state
    newState.portfolio = res
    return newState
  })
  .share()

const portfolioHistoricals$ = (request$, state$) => filterByCategory(request$, 'historicals')
  .flatMap(res => state$.take(1).map((state) => {
    const newState = state
    if (!newState.portfolio.historicals) {
      newState.portfolio.historicals = {}
    }
    newState.portfolio.historicals[res.request.span] = res.body.equity_historicals
    return newState
  }))
  .share()

const positions$ = (request$, state$) => filterByCategory(request$, 'positions')
  .map(res => res.body.results)
  .map(results => results.map(pos => {
    const newPos = pos
    newPos.instrumentId = instrumentIdFromUrl(pos.instrument)
    return newPos
  }))
  .flatMap(res => state$.take(1).map((state) => {
    const newState = state
    newState.positions = res
    return state
  }))
  .share()

const instruments$ = (request$, state$) => filterByCategory(request$, 'instruments')
  .flatMap(res => state$.take(1).map((state) => {
    const position = state.positions.find(p => p.instrumentId === res.request.instrumentId)
    position.instrument = res.body
    return state
  }))
  .share()

const quotes$ = (request$, state$) => filterByCategory(request$, 'quotes')
  .map(res => res.body.results)
  .flatMap(res => state$.take(1).map((state) => {
    res.forEach(quote => {
      const position = state.positions.find(p => p.instrument.symbol === quote.symbol)
      position.instrument.quote = quote
    })
    return state
  }))
  .share()

const quoteHistoricals$ = (request$, state$) => filterByCategory(request$, 'quoteHistorical')
  .flatMap(res => state$.take(1).map((state) => {
    const position = state.positions.find(p => p.instrument.symbol === res.body.symbol)
    if (!position.historicals) {
      position.historicals = {}
    }
    position.historicals[res.request.span] = res.body.historicals
    return state
  }))
  .share()

export default {
  user$,
  accounts$,
  portfolio$,
  portfolioHistoricals$,
  positions$,
  instruments$,
  quotes$,
  quoteHistoricals$,
}
