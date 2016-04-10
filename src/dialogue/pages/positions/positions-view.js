import {Observable} from 'rx'
import {div, p, h, h1, ul, li, a} from '@cycle/dom'
import helpers from '../../../helpers'
import {formatMoney, toFixed} from 'accounting'

const view = (state$, dataInterval$, router) => {
  const { createHref } = router
  return Observable.combineLatest(state$, dataInterval$, (s, di) => {
    const position = s.positions.find(p => p.instrument.symbol == s.currentInstrument)
    const quoteClass = helpers.quoteClass(position.instrument.quote)
    return div([
        div([
          h(`.paper-card-fake`, [
            div('.heading', [
              h1(s.currentInstrument)
            ]),
            h('.card-content', [
              h1(`.center.equity.${quoteClass}`,
                `${formatMoney(position.instrument.quote.last_trade_price)}`),
              div('.center', [
                h(`small.${quoteClass}`,
                  `(${helpers.quotePercentChangeStr(position.instrument.quote)}%)`)]),
              div('.chart-placeholder .chart-big'),
              div(['1D', '1M', '3M', '6M', '1Y'].map((i) =>
                div({ className: di === i ? 'chart-interval center selected' : 'chart-interval center' }, i))),
            ]),
            h('.card-actions', [
              a({href: createHref(`/positions/${position.instrument.symbol}/buy`)},
                h('paper-button', 'Buy')),
              a({href: createHref(`/positions/${position.instrument.symbol}/sell`)},
                h('paper-button', 'Buy'))
            ])
          ])
        ])
      ])
    }
  )
}

export default view
