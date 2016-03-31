import {Observable} from 'rx'
import responses from './portfolio-responses'

const portfolioModel = (request$, state$) => {
  const user$ = responses.user$(request$, state$)
  const accounts$ = responses.accounts$(request$, state$)
  const portfolio$ = responses.portfolio$(request$, state$)
  const historicals$ = responses.historicals$(request$, state$)
  const positions$ = responses.positions$(request$, state$)
  const instruments$ = responses.instruments$(request$, state$)
  const quotes$ = responses.quotes$(request$, state$)
  const quoteHistoricals$ = responses.quoteHistoricals$(request$, state$)

  return Observable.merge(state$.take(1), user$, accounts$, portfolio$, historicals$, positions$,
    instruments$, quotes$, quoteHistoricals$)
      .doOnNext((state) => window.localStorage.setItem("state", JSON.stringify(state)))
}

export default portfolioModel
