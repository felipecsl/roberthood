import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const model$ = model(sources.HTTP, state$)
  const view$ = view(model$)
  const request$ = model$.take(1)
  .flatMap(({token}) => [
    ({
      method: 'GET',
      eager: true,
      url: '/user?token=' + token,
      category: 'user',
    }),
    ({
      method: 'GET',
      eager: true,
      url: '/accounts?token=' + token,
      category: 'account',
    })
  ])

  return {
    DOM: view$,
    HTTP: request$,
    state$: model$
  }
}

export default Portfolio
