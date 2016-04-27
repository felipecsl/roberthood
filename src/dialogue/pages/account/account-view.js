import {div, h1, h2, h3, button, h, form, a, p} from '@cycle/dom'
import {formatMoney, toFixed} from 'accounting'

const view = (state$) => {
  return state$.take(1).map(s => {
    return div(`.account-layout`, [
      h('.paper-card-fake.account', [
        h1('.center', 'Account'),
        h('.card-content', [
          div(`.pane`, [
            h3(`${formatMoney(s.portfolio.last_core_equity)}`),
            p(`Stocks + Cash`),
          ]),
          div(`.pane`, [
            h3(`${formatMoney(s.account.buying_power)}`),
            p(`Buying Power`)
          ]),
          div(`.pane`, [
            h3(`${formatMoney(s.portfolio.last_core_market_value)}`),
            p(`Stocks`)
          ]),
          div(`.pane`, [
            h3(`${formatMoney(s.account.cash)}`),
            p(`Cash`)
          ]),
        ])
      ])
    ])
  })
}

export default view
