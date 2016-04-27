import {div, p, h, h1, ul, li, a} from '@cycle/dom'
import {formatMoney, toFixed} from 'accounting'
import helpers from '../../../helpers'
import EquityHistoricalData from '../../../models/equity-historical-data'
import QuoteHistoricalData from '../../../models/quote-historical-data'
import {Observable} from 'rx'

const view = (state$, dataInterval$, router) => {
  const { createHref } = router
  return Observable.combineLatest(state$, dataInterval$, (s, di) => {
    if (!helpers.isFullyLoaded(s)) {
      return h('paper-spinner-lite', { className: 'green', attributes: { active: '' }})
    }
    const equityHistoricalData = new EquityHistoricalData(s, di),
          absChange = equityHistoricalData.absChange(),
          percentChange = equityHistoricalData.percentChange(),
          equityClass = helpers.chartClass(absChange)
    // Use a fake paper-card component since virtual-dom doesn't handle well changes to Polymer's
    // paper-card, probably since it generates DOM elements dynamically and it confuses virtual-dom
    return div(`.portfolio-layout`, [
      h(`.paper-card-fake`, [
        div('.heading', [
          h1('Portfolio')
        ]),
        h(`.card-content`, [
          h1(`.center.equity .${equityClass}`,
            `${formatMoney(s.portfolio.last_core_equity)}`),
          div('.center', [
            h(`small.${equityClass}`, `${formatMoney(absChange)} (${toFixed(percentChange, 2)}%)`)]),
          div('.chart-placeholder .chart-big'),
          div(['1D', '1M', '3M', '6M', '1Y'].map((i) =>
            div({ className: di === i ? 'chart-interval center selected' : 'chart-interval center' }, i))),
          div('.portfolio-items', { attributes: { role: 'listbox' }}, s.positions.map(position => {
            const quoteData = new QuoteHistoricalData(position, di),
                  quoteAbsChange = quoteData.absChange(),
                  quoteClass = helpers.chartClass(quoteAbsChange)
            return h('paper-item', [
              h('paper-item-body', { attributes: { 'two-line': '' }}, [
                a({href: createHref(`/positions/${position.instrument.symbol}`)}, [
                  div([
                    `${position.instrument.symbol}`,
                    div(`.right .${quoteClass}}`, [
                      formatMoney(position.instrument.quote.last_trade_price)
                    ])
                  ]),
                  div({ attributes: { secondary: '' }}, [
                    `${helpers.formatShares(position.quantity)} Shares`,
                    h(`small .right .${quoteClass}`,
                      `${formatMoney(quoteAbsChange)} (${toFixed(quoteData.percentChange(), 2)}%)`)
                  ]),
                  div(`.quote-${position.instrument.symbol}-chart-placeholder .center .chart-small`)
                ])
              ])
            ])
          }))
        ])
      ])
    ])
  })
}

export default view
