import Home from '../../pages/home/home-index'
import Portfolio from '../../pages/portfolio/portfolio-index'
import Positions from '../../pages/positions/positions-index'
import Account from '../../pages/account/account-index'
import Buy from '../../pages/buy/buy-index'
import Page404 from '../../pages/page404/page404-index'
import {Observable} from 'rx'

const routes = {
  '/': Home,
  '/portfolio': Portfolio,
  '/account': Account,
  '/positions/:id': id => sources => Positions({props$: Observable.of({id}), ...sources}),
  '/positions/:id/buy': id => sources => Buy({props$: Observable.of({id}), ...sources}),
  '*': Page404,
}

function ContentRouter(sources) {
  const {router, state$} = sources
  const match$ = router.define(routes)
  const childrenDOM$ = match$.map(({path, value}) => {
      const comp = value({
        ...sources,
        router: router,
        state$: state$.take(1),
      })
      return {
        DOM: comp.DOM,
        HTTP: comp.HTTP,
        state$: comp.state$,
        historicalData: comp.historicalData,
      }
    }
  )


  return {
    DOM: childrenDOM$.flatMapLatest(s => s.DOM),
    HTTP: childrenDOM$.flatMapLatest(s => s.HTTP),
    historicalData: childrenDOM$.flatMapLatest(s => s.historicalData),
    state$: childrenDOM$.flatMapLatest(s => s.state$),
    path$: match$.pluck('path'),
  }
}

export default ContentRouter
