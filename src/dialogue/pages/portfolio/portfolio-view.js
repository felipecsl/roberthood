import {div, p, h, h1, ul, li} from '@cycle/dom'
import {formatMoney} from 'accounting'

const view = state$ => {
  return state$.map(s => {
    const portfolioPresent = s.portfolio !== undefined
    const positions = s.positions !== undefined ? s.positions : []
    if (!portfolioPresent) {
      return h1('Loading...')
    }
    return div([
      div(`${portfolioPresent ? '.visible' : '.invisible'}`, [
        div([
          h('paper-card', { heading: 'Portfolio' }, [
            h('.card-content', [
              h1(formatMoney(s.portfolio.last_core_equity))
            ]),
            ul(positions.map(position =>
              li(position.instrument)
            ))
          ])
        ])
      ])
    ])
  })
}

export default view
