import {Observable} from 'rx'
import view from './portfolio-view'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const $view = view(state$)

  return {
    DOM: Observable.just($view),
    HTTP: sources.HTTP,
    state$: state$
  }
}

export default Portfolio
