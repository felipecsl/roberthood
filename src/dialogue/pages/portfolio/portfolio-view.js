import {div, p, h, h1, ul, li} from '@cycle/dom'
import {formatMoney} from 'accounting'
import helpers from './helpers'

const view = state$ => {
  return state$.map(s => {
    if (!helpers.isFullyLoaded(s)) {
      return h('paper-spinner-lite', { className: 'green', attributes: { active: '' }})
    }
    return div([
      div([
        div([
          h('paper-card', { heading: 'Portfolio' }, [
            h('.card-content', [
              h1(`.center .${helpers.equityClass(s.portfolio)}`, formatMoney(s.portfolio.last_core_equity)),
              div('.chart-placeholder'),
              div('.portfolio-items', { attributes: { role: 'listbox' }}, s.positions.map(position =>
                h('paper-item', [
                  h('paper-item-body', { attributes: { 'two-line': '' }}, [
                    div([
                      `${position.instrument.symbol}`,
                      div(`.right .${helpers.quoteClass(position.instrument.quote)}`, [
                        formatMoney(position.instrument.quote.last_trade_price)
                      ])
                    ]),
                    div({ attributes: { secondary: '' }}, [
                      `${helpers.formatShares(position.quantity)} Shares`
                    ])
                  ])
                ])
              ))
            ])
          ])
        ])
      ])
    ])
  })
}

export default view
