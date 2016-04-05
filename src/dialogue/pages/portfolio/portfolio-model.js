import {Observable} from 'rx'
import responses from './portfolio-responses'

const portfolioModel = (request$, state$) => {
  const user$ = responses.user$(request$, state$)
  const accounts$ = responses.accounts$(request$, state$)
  const portfolio$ = responses.portfolio$(request$, state$)
  const portfolioIntradayHistoricals$ = responses.portfolioIntradayHistoricals$(request$, state$)
  const portfolioDailyHistoricals$ = responses.portfolioDailyHistoricals$(request$, state$)
  const positions$ = responses.positions$(request$, state$)
  const instruments$ = responses.instruments$(request$, state$)
  const quotes$ = responses.quotes$(request$, state$)
  const quoteIntradayHistoricals$ = responses.quoteIntradayHistoricals$(request$, state$)
  const quoteDailyHistoricals$ = responses.quoteDailyHistoricals$(request$, state$)

  return Observable.merge(state$.take(1),
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
  )
}

export default portfolioModel
