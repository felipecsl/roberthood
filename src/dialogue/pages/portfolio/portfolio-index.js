import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const model$ = model(sources.HTTP, state$)
  const view$ = view(model$)
  const request$ = model$.filter(m => m.token !== undefined)
    .take(1)
    .flatMap(({token}) => [({
      method: 'GET',
      eager: true,
      url: `/user?token=${token}`,
      category: 'user',
    }),({
      method: 'GET',
      eager: true,
      url: `/accounts?token=${token}`,
      category: 'account',
    })
  ])
  const portfolio$ = model$.filter(m => m.account !== undefined)
    .take(1)
    .flatMap(({account, token}) => Observable.from([({
      method: 'GET',
      eager: true,
      url: `/accounts/${account.account_number}/portfolio?token=${token}`,
      category: 'portfolio',
    }), ({
      method: 'GET',
      eager: true,
      url: `/positions/${account.account_number}?token=${token}`,
      category: 'positions',
    })]))
  const instrument$ = model$.filter(m => m.positions !== undefined)
    .take(1)
    .flatMap(({positions, token}) => positions.map(position => ({
      method: 'GET',
      eager: true,
      url: `/instruments/${position.instrumentId}?token=${token}`,
      instrumentId: position.instrumentId,
      category: 'instruments',
    })))

  return {
    DOM: view$,
    HTTP: Observable.merge(request$, portfolio$, instrument$),
    state$: model$
  }
}

export default Portfolio
