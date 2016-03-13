import {Observable} from 'rx'

const portfolioModel = (request$, state$) => {
  const user$ = request$.flatMap(x => x)
      .filter(res$ => res$.request.category === 'user')
      .flatMap(res => state$.take(1).map((state) => {
        state.user = res.body
        return state
      }))
  const accounts$ = request$.flatMap(x => x)
      .filter(res$ => res$.request.category === 'account')
      .flatMap(res => state$.take(1).map((state) => {
        state.account = res.body.results[0]
        return state
      }))
  const portfolio$ = request$.flatMap(x => x)
      .filter(res$ => res$.request.category === 'portfolio')
      .flatMap(res => state$.take(1).map((state) => {
        state.portfolio = res.body
        return state
      }))
  const positions$ = request$.flatMap(x => x)
      .filter(res$ => res$.request.category === 'positions')
      .flatMap(res => state$.take(1).map((state) => {
        state.positions = res.body.results
        return state
      }))
  return Observable.merge(
    state$.take(1), user$, accounts$, portfolio$, positions$)
}

export default portfolioModel
