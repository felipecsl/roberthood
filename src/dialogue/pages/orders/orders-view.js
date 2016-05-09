import {Observable} from 'rx'
import {div, p, h, h1, ul, li, a, form, hr} from '@cycle/dom'
import {formatMoney, toFixed} from 'accounting'

export default (state$) => state$
  .map(s => {
    if (s.orders && s.orders.every(o => typeof o.instrument === 'object')) {
      return div([
        h(`paper-card`, { heading: 'Orders' }, [
          h(`.card-content.orders`, [
            h(`paper-listbox`, { attributes: { role: 'listbox' }}, s.orders.map(o => h('paper-item', [
              h('paper-item-body', { attributes: { 'two-line': '' }}, [
                div([
                  o.instrument.symbol,
                  div(`.right`, `${o.type} ${o.side}`),
                ]),
                div({ attributes: { secondary: '' }}, [
                  div([
                    o.state,
                    div(`.right`, `${formatMoney(parseInt(o.quantity) * o.average_price)}`),
                  ]),
                ])
              ])
            ])))
          ])
        ])
      ])
    }

    return h('paper-spinner-lite', { className: 'green', attributes: { active: '' }})
  })
