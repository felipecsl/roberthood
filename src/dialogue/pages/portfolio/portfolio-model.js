import {
  Observable,
  ReplaySubject,
} from 'rx'
import responses from './portfolio-responses'
import logger from '../../../logger'

export default (globalActions$, request$, state$) => {
  // GOTCHA: Use a Subject so we can have the model subscribe to itself. That's needed because an
  // update to the model may require new requests to be fired, specifically for when the user clicks
  // the reload button (globalActions$)
  const modelProxy$ = new ReplaySubject(1)
  const user$ = responses.user$(request$, modelProxy$)
  const accounts$ = responses.accounts$(request$, modelProxy$)
  const portfolio$ = responses.portfolio$(request$, modelProxy$)
  const portfolioIntradayHistoricals$ = responses.portfolioIntradayHistoricals$(request$, modelProxy$)
  const portfolioDailyHistoricals$ = responses.portfolioDailyHistoricals$(request$, modelProxy$)
  const positions$ = responses.positions$(request$, modelProxy$)
  const instruments$ = responses.instruments$(request$, modelProxy$)
  const quotes$ = responses.quotes$(request$, modelProxy$)
  const quoteIntradayHistoricals$ = responses.quoteIntradayHistoricals$(request$, modelProxy$)
  const quoteDailyHistoricals$ = responses.quoteDailyHistoricals$(request$, modelProxy$)
  const resetState$ = globalActions$.withLatestFrom(state$, (g, s) => {
    logger.log('PORTFOLIO MODEL - resetting state')
    return { token: s.token }
  })
  const model$ = Observable.merge(
    state$,
    user$,
    accounts$,
    portfolio$,
    portfolioIntradayHistoricals$,
    positions$,
    portfolioDailyHistoricals$,
    instruments$,
    quotes$,
    quoteIntradayHistoricals$,
    quoteDailyHistoricals$,
    resetState$).share()

  model$.subscribe(modelProxy$)

  return model$
}
