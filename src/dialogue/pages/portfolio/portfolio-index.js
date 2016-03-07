import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const state$$ = model(sources.HTTP, state$)
  const view$ = view(state$$)
  const request$ = state$$.take(1).map(({token}) => ({
    method: 'GET',
    url: '/user?token=' + token
  }))

  return {
    DOM: view$,
    HTTP: request$,
    state$: state$$
  }
}

export default Portfolio
