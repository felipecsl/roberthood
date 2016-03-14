import {div, p, h, h1, ul, li} from '@cycle/dom'
import {formatMoney} from 'accounting'

function formatShares(amount) {
  return amount.substring(0, amount.indexOf("."))
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
              h1(formatMoney(s.portfolio.last_core_equity))
            ]),
            div('.portfolio-items', { attributes: { role: 'listbox' }}, positions.map(position =>
              h('paper-item', [
                h('paper-item-body', { attributes: { 'two-line': '' }}, [
                  div([
                    `${position.instrument.symbol}`,
                    div('.right', formatMoney(position.instrument.quote.last_trade_price))
                  ]),
                  div({ attributes: { secondary: '' }}, `${formatShares(position.quantity)} Shares`)
                ])
              ])
            ))
          ])
        ])
      ])
    ])
  })
}

export default view
