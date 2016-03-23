import {Observable} from 'rx'
import responses from './responses'

const portfolioModel = (request$, state$) => {
  const user$ = responses.user$(request$, state$)
  const accounts$ = responses.accounts$(request$, state$)
  const portfolio$ = responses.portfolio$(request$, state$)
  const historicals$ = responses.historicals$(request$, state$)
  const positions$ = responses.positions$(request$, state$)
  const instruments$ = responses.instruments$(request$, state$)
  const quotes$ = responses.quotes$(request$, state$)

  return Observable.merge(state$.take(1), user$, accounts$, portfolio$,
    historicals$, positions$, instruments$, quotes$)
}

export default portfolioModel
