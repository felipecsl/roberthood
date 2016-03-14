import {div, p, h, h1, ul, li} from '@cycle/dom'
import {formatMoney} from 'accounting'

function formatShares(amount) {
  return amount.substring(0, amount.indexOf("."))
}

const view = state$ => {
  return state$.map(s => {
    const positions = s.positions !== undefined ? s.positions : []
    const instrumentsPresent = positions.map(p => p.instrument)
      .every(i => i.symbol !== undefined)
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
            h('paper-listbox', positions.map(position =>
              h('paper-item', `${formatShares(position.quantity)} Shares - ${position.instrument.symbol}`)))
          ])
        ])
      ])
    ])
  })
}

export default view
