import {Observable} from 'rx'

const portfolioModel = (request$, state$) => {
  const user$ = request$.flatMap(x => x)
      .filter(res$ => res$.request.category === 'user')
      .flatMap(res => state$.take(1).map(({token}) => ({
        token: token,
        user: res.body
      })))
  const account$ = request$.flatMap(x => x)
      .filter(res$ => res$.request.category === 'account')
      .flatMap(res => state$.take(1).map(({user, token}) => ({
        token: token,
        user: user,
        account: res.body.results[0]
      })))
  return Observable.merge(state$.take(1), user$, account$)
}

export default portfolioModel
