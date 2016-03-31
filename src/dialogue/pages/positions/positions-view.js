import {Observable} from 'rx'
import {div, p, h, h1, ul, li, a} from '@cycle/dom'
import helpers from '../../../helpers'
import {formatMoney, toFixed} from 'accounting'

const view = (state$, router) => {
  return state$.map(s => {
    const position = s.positions.find(p => p.instrument.symbol == s.currentInstrument)
    const quoteClass = helpers.quoteClass(position.instrument.quote)
    return div([
        div([
          h('paper-card', { heading: s.currentInstrument }, [
            h('.card-content', [
              h1(`.center.equity.${quoteClass}`,
                `${formatMoney(position.instrument.quote.last_trade_price)}`),
              div('.chart-placeholder .chart-big'),
            ])
          ])
        ])
      ])
    }
  )
}

export default view
