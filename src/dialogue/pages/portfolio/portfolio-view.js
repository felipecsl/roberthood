import {div, p, h, h1, ul, li} from '@cycle/dom'
import {formatMoney} from 'accounting'

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
    ? ".quote-up" : ".quote-down"
}

const view = state$ => {
  return state$.map(s => {
    const positions = s.positions !== undefined ? s.positions : []
    const instrumentsPresent = positions.map(p => p.instrument)
      .every(i => i.symbol !== undefined
        && i.quote !== undefined
        && i.quote.last_trade_price !== undefined)
    if (positions.length == 0 || !instrumentsPresent) {
      return h1('Loading portfolio...')
    }
    return div([
      div([
        div([
          h('paper-card', { heading: 'Portfolio' }, [
            h('.card-content', [
              h1('.center', formatMoney(s.portfolio.last_core_equity)),
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
