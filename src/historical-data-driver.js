import logger from './logger'
import { drawLineChart } from './graphs/line'
import { drawCandleChart } from './graphs/candle'

const makeHistoricalDataDriver = () => (sink$) => {
  logger.log("HistoricalDataDriver - Subscribing to sink: ", sink$)
  sink$.subscribe(chartData => {
    const type = chartData.type
    if (type === 'line') {
      drawLineChart(chartData)
    } else if (type === 'candle') {
      drawCandleChart(chartData)
    }
  })
}


export { makeHistoricalDataDriver }
