import Rx from 'rx'
import view from './portfolio-view'

const Portfolio = (sources) => {
  const state$ = sources.state$
  const $view = view(state$)

  return {
    DOM: Rx.Observable.just($view),
    state$: state$,
  }
}

export default Portfolio
