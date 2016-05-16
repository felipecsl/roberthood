import { Observable } from 'rx'
import { div, h, h1, a } from '@cycle/dom'
import { chartClass } from '../../../helpers'
import QuoteHistoricalData from '../../../models/quote-historical-data'
import { formatMoney, toFixed } from 'accounting'

const view = (state$, dataInterval$, router) => {
  const { createHref } = router
  return Observable.combineLatest(state$, dataInterval$, (s, di) => {
    const position = s.positions.find(p => p.instrument.symbol === s.currentInstrument)
    const quoteHistoricalData = new QuoteHistoricalData(position, di)
    const absChange = quoteHistoricalData.absChange()
    const percentChange = quoteHistoricalData.percentChange()
    const quoteClass = chartClass(absChange)
    return div([
      div([
        h(`.paper-card-fake`, [
          div('.heading.clearFix', [
            h1(`.left`, `${position.instrument.name} (${position.instrument.symbol})`),
            a(`.right`, { href: createHref(`/graphs/${position.instrument.symbol}`) }, [
              h('paper-icon-button', { icon: "open-in-new", title: "Expand graph..." }),
            ]),
          ]),
          h('.card-content', [
            h1(`.center.equity.${quoteClass}`,
              `${formatMoney(position.instrument.quote.last_trade_price)}`),
            div('.center', [
              h(`small.${quoteClass}`,
                `${formatMoney(absChange)} (${toFixed(percentChange, 2)}%)`)]),
            div(`.quote-${position.instrument.symbol}-chart-placeholder .chart-big`),
            div(['1D', '1M', '3M', '6M', '1Y'].map((i) =>
              div({ className: (di === i ? 'chart-interval center selected'
                : 'chart-interval center') }, i))),
          ]),
          h('.card-actions', [
            a({ href: createHref(`/positions/${position.instrument.symbol}/buy`) },
              h('paper-button', 'Buy')),
            a({ href: createHref(`/positions/${position.instrument.symbol}/sell`) },
              h('paper-button', 'Sell')),
          ]),
        ]),
      ]),
    ])
  })
}

export default view
