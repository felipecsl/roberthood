import {div, p, h, h1, ul, li} from '@cycle/dom'
import {formatMoney, toFixed} from 'accounting'
import helpers from './helpers'

const view = state$ => {
  return state$.map(s => {
    if (!helpers.isFullyLoaded(s)) {
      return h('paper-spinner-lite', { className: 'green', attributes: { active: '' }})
    }
    const absChange = s.portfolio.last_core_equity - s.portfolio.adjusted_equity_previous_close
    const percentChange = (absChange / s.portfolio.last_core_equity) * 100
    const equityClass = helpers.equityClass(s.portfolio)

    return div([
      div([
        div([
          h('paper-card', { heading: 'Portfolio' }, [
            h('.card-content', [
              h1(`.center.equity .${equityClass}`,
                `${formatMoney(s.portfolio.last_core_equity)}`),
              div('.center', [
                h(`small.${equityClass}`, `${formatMoney(absChange)} (${toFixed(percentChange, 2)}%)`)]),
              div('.chart-placeholder .chart-big'),
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
                      `${helpers.formatShares(position.quantity)} Shares`,
                      h(`small .right .${helpers.quoteClass(position.instrument.quote)}`,
                        `(${helpers.quotePercentChangeStr(position.instrument.quote)}%)`)
                    ]),
                    div(`.quote-${position.instrument.symbol}-chart-placeholder .center .chart-small`),
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
