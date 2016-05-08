import Home from '../../pages/home/home-index'
import Portfolio from '../../pages/portfolio/portfolio-index'
import Positions from '../../pages/positions/positions-index'
import Account from '../../pages/account/account-index'
import Buy from '../../pages/buy/buy-index'
import Orders from '../../pages/orders/orders-index'
import Page404 from '../../pages/page404/page404-index'
import {Observable} from 'rx'
import logger from '../../../logger'

const routes = {
  '/': Home,
  '/portfolio': Portfolio,
  '/account': Account,
  '/orders': Orders,
  '/positions/:id': id => sources => Positions({props$: Observable.of({id}), ...sources}),
  '/positions/:id/buy': id => sources => Buy({props$: Observable.of({id}), ...sources}),
  '*': Page404,
}

function ContentRouter(sources) {
  logger.log('ContentRouter#init')
  const {router, state$} = sources
  const match$ = router.define(routes)
  const childrenSinks$ = match$.map(({value}) => {
    console.log('router#match')
    return value({
      ...sources,
      state$: state$.take(1),
    })
  })

  return {
    DOM: childrenSinks$.flatMapLatest(s => s.DOM),
    HTTP: childrenSinks$.flatMapLatest(s => s.HTTP),
    historicalData: childrenSinks$.flatMapLatest(s => s.historicalData || Observable.empty()),
    state$: childrenSinks$.flatMapLatest(s => s.state$),
    globalActions$: childrenSinks$.flatMapLatest(s => s.globalActions$ || Observable.empty()),
    path$: match$.pluck('path'),
  }
}

export default ContentRouter
