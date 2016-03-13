import {div, p, h, h1} from '@cycle/dom'
import {formatMoney} from 'accounting'

const view = state$ => {
  return state$.map(s => {
    const portfolioPresent = s.portfolio !== undefined
    if (!portfolioPresent) {
      return h1('Loading...')
    }
    return div([
      div(`${portfolioPresent ? '.visible' : '.invisible'}`, [
        div([
          h('paper-card', { heading: 'Portfolio' }, [
            h('.card-content', [
              h1(formatMoney(s.portfolio.last_core_equity))
            ])
          ])
        ])
      ])
    ])
  })
}

export default view
