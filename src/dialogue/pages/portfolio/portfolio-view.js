import {div, p, h, h1, ul, li} from '@cycle/dom'
import {formatMoney} from 'accounting'
import {d3} from 'd3'

const CLASS_QUOTE_UP = ".quote-up"
const CLASS_QUOTE_DOWN = ".quote-down"

/**
 * Formats the number of shares amount as an Integer. Eg.: "2.000" -> "2"
 */
function formatShares(amount) {
  return amount.substring(0, amount.indexOf("."))
}

/**
 * Returns the CSS class name to be used for displaying the provided quote based on whether
 * it is going up or down
 */
function quoteClass(quote) {
  return parseFloat(quote.last_trade_price) > parseFloat(quote.previous_close)
    ? CLASS_QUOTE_UP : CLASS_QUOTE_DOWN
}

/**
 * Returns the CSS class name to be used for displaying the provided portfolio based on
 * whether it is going up or down.
 */
function equityClass(portfolio) {
  return parseFloat(portfolio.last_core_equity) > parseFloat(portfolio.equity_previous_close)
    ? CLASS_QUOTE_UP : CLASS_QUOTE_DOWN
}

const view = state$ => {
  return state$.map(s => {
    const positions = s.positions !== undefined ? s.positions : []
    const instrumentsPresent = positions.map(p => p.instrument)
      .every(i => i.symbol !== undefined && i.quote !== undefined
        && i.quote.last_trade_price !== undefined)
    if (positions.length == 0 || !instrumentsPresent) {
      return h('paper-spinner-lite', { className: 'green', attributes: { active: '' }})
    }
    return div([
      div([
        div([
          h('paper-card', { heading: 'Portfolio' }, [
            h('.card-content', [
              h1(`.center .${equityClass(s.portfolio)}`, formatMoney(s.portfolio.last_core_equity)),
              div('.chart-placeholder'),
              div('.portfolio-items', { attributes: { role: 'listbox' }}, positions.map(position =>
                h('paper-item', [
                  h('paper-item-body', { attributes: { 'two-line': '' }}, [
                    div([
                      `${position.instrument.symbol}`,
                      div(`.right .${quoteClass(position.instrument.quote)}`, [
                        formatMoney(position.instrument.quote.last_trade_price)
                      ])
                    ]),
                    div({ attributes: { secondary: '' }}, [
                      `${formatShares(position.quantity)} Shares`
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
