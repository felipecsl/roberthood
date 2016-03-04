import {Observable} from 'rx'
import view from './portfolio-view'
import model from './portfolio-model'
import helpers from './helpers'

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
  const instruments$ = model$.filter(m => m.positions !== undefined)
    .take(1)
    .flatMap(({positions, token}) => positions.map(position => ({
      method: 'GET',
      eager: true,
      url: `/instruments/${position.instrumentId}?token=${token}`,
      instrumentId: position.instrumentId,
      category: 'instruments',
    })))
  const quotes$ = model$.filter(m => m.positions !== undefined)
    .filter(m => m.positions.every(p => p.instrument.symbol !== undefined))
    .take(1)
    .flatMap(({positions, token}) => Observable.just({
      method: 'GET',
      eager: true,
      url: `/quotes?symbols=${positions.map(p => p.instrument.symbol).join(',')}&token=${token}`,
      category: 'quotes',
    }))
  // this needs to happen after the UI finished loading completely
  const historicals$ = model$.filter(m => helpers.isFullyLoaded(m))
    .take(1)
    .flatMap(({account, token}) => Observable.just({
      method: 'GET',
      eager: true,
      url: `/portfolios/historicals/${account.account_number}?token=${token}`,
      category: 'historicals',
    }))
  const historicalsData$ = model$.filter(m => m.historicals !== undefined)
    .take(1)
    .map(state => state.historicals)

  return {
    DOM: view$,
    HTTP: Observable.merge(
      request$, portfolio$, instruments$, quotes$, historicals$),
    state$: model$,
    historicalData: historicalsData$
  }
}

export default Portfolio
