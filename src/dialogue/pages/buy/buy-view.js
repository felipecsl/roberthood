import {Observable} from 'rx'
import {div, p, h, h1, ul, li, a, form, hr} from '@cycle/dom'
import helpers from '../../../helpers'
import QuoteHistoricalData from '../../../models/quote-historical-data'
import {formatMoney, toFixed} from 'accounting'

const view = (state$, action$, router) => {
  const { createHref } = router
  return action$.map(amount => state$.map(s => {
    const position = s.positions.find(p => p.instrument.symbol == s.currentInstrument)
    return div([
      h(`.paper-card-fake.buy-form`, [
        div('.heading', [
          h1(`Buy ${position.instrument.symbol}`),
        ]),
        h('.card-content', [
          form({ autocomplete: 'off' }, [
            h(`paper-input.shares`, {
              label: `Shares of ${position.instrument.symbol}`,
              type: 'number',
            }),
            h(`paper-input.price`, {
              label: 'Market Price',
              value: formatMoney(position.instrument.quote.last_trade_price)
            }),
            h(`paper-input.cost`, {
              label: 'Estimated Cost',
              readonly: 'readonly',
              value: formatMoney(amount * position.instrument.quote.last_trade_price)
            }),
          ])
        ]),
        h('.card-actions', [
          h('paper-button.Buy', 'Buy')
        ])
      ])
    ])
  }))
}

export default view
