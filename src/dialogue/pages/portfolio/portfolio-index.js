import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const model$ = model(sources.HTTP, state$)
  const view$ = view(model$)
  const request$ = model$.take(1)
    .flatMap(({token}) => [({
      method: 'GET',
      eager: true,
      url: '/user?token=' + token,
      category: 'user',
    }),({
      method: 'GET',
      eager: true,
      url: '/accounts?token=' + token,
      category: 'account',
    })
  ])
  const portfolio$ = model$.filter(m => m.account !== undefined)
    .take(1)
    .flatMap(({account, token}) => Observable.just(({
      method: 'GET',
      eager: true,
      url: `/accounts/${account.account_number}/portfolio?token=` + token,
      category: 'portfolio',
    })))

  return {
    DOM: view$,
    HTTP: Observable.merge(request$, portfolio$),
    state$: model$
  }
}

export default Portfolio
