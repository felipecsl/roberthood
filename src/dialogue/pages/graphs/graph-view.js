import { div, h1, h } from '@cycle/dom'
import QuoteHistoricalData from '../../../models/quote-historical-data'
import { chartClass } from '../../../helpers'
import { formatMoney, toFixed } from 'accounting'

const view = (state$) => state$.map(s => {
  const position = s.positions.find(p => p.instrument.symbol === s.currentInstrument)
  const quoteHistoricalData = new QuoteHistoricalData(position, '1Y')
  const absChange = quoteHistoricalData.absChange()
  const percentChange = quoteHistoricalData.percentChange()
  const quoteClass = chartClass(absChange)

  return div('.graph-container', [
    h1(`${position.instrument.name} (${position.instrument.symbol})`),
    h1(`.center.equity.${quoteClass}`,
      `${formatMoney(position.instrument.quote.last_trade_price)}`),
    div('.center', [
      h(`small.${quoteClass}`,
        `${formatMoney(absChange)} (${toFixed(percentChange, 2)}%)`)]),
    div(`.quote-${position.instrument.symbol}-chart-placeholder .chart-big`),
  ])
})

export default view
