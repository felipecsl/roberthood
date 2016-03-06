import Home from '../../pages/home/home-index'
import Portfolio from '../../pages/portfolio/portfolio-index'
import Page404 from '../../pages/page404/page404-index'

const routes = {
  '/': Home,
  '/portfolio': Portfolio,
  '*': Page404,
}

function ContentRouter(sources) {
  const {router, state$} = sources
  const {path$, value$} = router.define(routes)
  const childrenDOM$ = path$.zip(value$,
    (path, value) => {
      const comp = value({
        ...sources,
        router: router.path(path),
        state$: state$.take(1),
      })
      return {
        DOM: comp.DOM,
        HTTP: comp.HTTP,
        state$: comp.state$,
      }
    }
  )

  return {
    DOM: childrenDOM$.flatMapLatest(s => s.DOM),
    HTTP: childrenDOM$.flatMapLatest(s => s.HTTP),
    state$: childrenDOM$.flatMapLatest(s => s.state$),
    path$: path$,
  }
}

export default ContentRouter
