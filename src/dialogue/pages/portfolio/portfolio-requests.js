import { Observable } from 'rx'
import { isFullyLoaded, interval, span } from '../../../helpers'

const _account$ = ({ token }) => [({
  method: 'GET',
  eager: true,
  url: `/user?token=${token}`,
  category: 'user',
}), ({
  method: 'GET',
  eager: true,
  url: `/accounts?token=${token}`,
  category: 'account',
})]

const _portfolio$ = ({ account, token }) => Observable.just({
  method: 'GET',
  eager: true,
  url: `/accounts/${account.account_number}/portfolio?token=${token}`,
  category: 'portfolio',
})

const _positions$ = ({ account, token }) => Observable.just({
  method: 'GET',
  eager: true,
  url: `/positions/${account.account_number}?token=${token}`,
  category: 'positions',
})

const _instruments$$ = ({ positions, token }) => positions.map(position => ({
  method: 'GET',
  eager: true,
  url: `/instruments/${position.instrumentId}?token=${token}`,
  instrumentId: position.instrumentId,
  category: 'instruments',
}))

const _quotes$ = ({ positions, token }) => Observable.just({
  method: 'GET',
  eager: true,
  url: `/quotes?symbols=${positions.map(p => p.instrument.symbol).join(',')}&token=${token}`,
  category: 'quotes',
})

const _quotesHistoricals$ = (positions, token, intervalStr) => positions.map(p => ({
  method: 'GET',
  eager: true,
  url: `/quotes/historicals/${p.instrument.symbol}?interval=${interval(intervalStr)}&span=${span(intervalStr)}&token=${token}`,
  category: 'quoteHistorical',
  span: span(intervalStr),
}))

const _historicals$ = (account, token, intervalStr) => Observable.just({
  method: 'GET',
  eager: true,
  url: `/portfolios/historicals/${account.account_number}?interval=${interval(intervalStr)}&span=${span(intervalStr)}&token=${token}`,
  category: 'historicals',
  span: span(intervalStr),
})

const requests = (model$) => {
  // This prevents us from requesting all over again when the state is already fully loaded
  const notLoadedModel$ = model$.filter(m => !isFullyLoaded(m))
  const account$ = notLoadedModel$
    .filter(m => m.token && !m.user && !m.account)
    .flatMap(_account$)
  const portfolio$ = notLoadedModel$
    .filter(m => m.account && !m.portfolio && !m.positions)
    .flatMap(_portfolio$)
  const positions$ = notLoadedModel$
    .filter(m => m.portfolio && !m.positions)
    .flatMap(_positions$)
  const instruments$ = notLoadedModel$
    .filter(m => m.positions && m.positions.every(p => typeof p.instrument === 'string'))
    .take(1)
    .flatMap(_instruments$$)
  const quotes$ = notLoadedModel$
    .filter(m => m.positions !== undefined)
    .filter(m => m.positions.every(p => p.instrument.symbol !== undefined))
    .take(1)
    .flatMap(_quotes$)
  const quotesHistoricals$ = Observable.from(['1D', '1M', 'ALL'])
    .map(i => model$.filter(m => m.positions !== undefined)
      .filter(m => m.positions.every(p => p.instrument.symbol !== undefined
        && !p.historicals))
      .take(1)
      .flatMap(h => _quotesHistoricals$(h.positions, h.token, i))
    ).flatMap(x => x)
  const historicals$ = Observable.from(['1D', '1M', 'ALL'])
    .map(i => model$.filter(m => isFullyLoaded(m)
        && !m.portfolio.historicals)
      .take(1)
      .flatMap(h => _historicals$(h.account, h.token, i))
    ).flatMap(x => x)

  return Observable.merge(
    account$,
    portfolio$,
    positions$,
    instruments$,
    quotes$,
    quotesHistoricals$,
    historicals$)
}

export default requests
