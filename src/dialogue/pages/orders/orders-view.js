import {Observable} from 'rx'
import {div, p, h, h1, ul, li, a, form, hr} from '@cycle/dom'
import {formatMoney, toFixed} from 'accounting'
import helpers from '../../../helpers'

export default (state$) => state$.filter(m => m.orders !== undefined)
  .map(s => div([
    h(`paper-card`, { heading: 'Orders' }, [
      h(`.card-content.orders`, [
        h(`paper-listbox`, { attributes: { role: 'listbox' }}, s.orders.map(o => h('paper-item', [
          h('paper-item-body', { attributes: { 'two-line': '' }}, [
            div([
              o.state,
              div(`.right`, `${o.type} ${o.side}`),
            ]),
            div({ attributes: { secondary: '' }}, [
              div([
                s.positions.find(p =>
                  p.instrumentId === helpers.instrumentIdFromUrl(o.instrument)).symbol,
                div(`.right`, `${formatMoney(parseInt(o.quantity) * o.average_price)}`),
              ]),
            ])
          ])
        ])))
      ])
    ])
  ]))
