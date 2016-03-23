import {Observable} from 'rx'

const account$ = ({token}) => [({
  method: 'GET',
  eager: true,
  url: `/user?token=${token}`,
  category: 'user',
}),({
  method: 'GET',
  eager: true,
  url: `/accounts?token=${token}`,
  category: 'account',
})]

const portfolio = (account_number, token) => ({
  method: 'GET',
  eager: true,
  url: `/accounts/${account_number}/portfolio?token=${token}`,
  category: 'portfolio',
})

const positions = (account_number, token) => ({
  method: 'GET',
  eager: true,
  url: `/positions/${account_number}?token=${token}`,
  category: 'positions',
})

const portfolio$ = ({account, token}) => Observable.from([
  portfolio(account.account_number, token),
  positions(account.account_number, token)
])

const instruments$$ = ({positions, token}) => positions.map(position => ({
  method: 'GET',
  eager: true,
  url: `/instruments/${position.instrumentId}?token=${token}`,
  instrumentId: position.instrumentId,
  category: 'instruments',
}))

const quotes$ = ({positions, token}) => Observable.just({
  method: 'GET',
  eager: true,
  url: `/quotes?symbols=${positions.map(p => p.instrument.symbol).join(',')}&token=${token}`,
  category: 'quotes',
})

const historicals$ = ({account, token}) => Observable.just({
  method: 'GET',
  eager: true,
  url: `/portfolios/historicals/${account.account_number}?token=${token}`,
  category: 'historicals',
})

export default {account$, portfolio$, instruments$$, quotes$, historicals$}
