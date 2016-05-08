import d3 from 'd3'
import logger from './logger'

const formatLineData = (data) => data
  .map(d => [d.open_price, d.close_price])
  .reduce((a, b) => a.concat(b), [])
  .map(d => parseFloat(d))

const formatCandleData = (data) => data.map(d => ({
  begins_at: d.begins_at,
  open_price: parseFloat(d.open_price),
  close_price: parseFloat(d.close_price),
  high_price: parseFloat(d.high_price),
  low_price: parseFloat(d.low_price),
  volume: d.volume,
  interpolated: d.interpolated,
}))

/** Exposed for unit tests */
const parseData = (chartData, type = 'line') =>
  type === 'line' ? parseLineData(chartData) : parseCandleData(chartData)

const parseCandleData = (chartData) => {
  const formattedData = formatCandleData(chartData.data),
        isTrendingUp = (chartData.displayPrevClose
          ? formattedData[formattedData.length - 1].open_price > chartData.prevClose
          : formattedData[formattedData.length - 1].close_price > formattedData[0].close_price)

  return {
    data: formattedData,
    minValue: Math.min(chartData.prevClose || Number.MAX_VALUE,
      Math.min(...formattedData.map(d => Math.min(d.open_price, d.close_price)))),
    maxValue: Math.max(chartData.prevClose || Number.MIN_VALUE,
      Math.max(...formattedData.map(d => Math.max(d.open_price, d.close_price)))),
    klass: isTrendingUp ? 'quote-up' : 'quote-down'
  }
}

const parseLineData = (chartData) => {
  const formattedData = formatLineData(chartData.data),
        isTrendingUp = (chartData.displayPrevClose
          ? formattedData[formattedData.length - 1] > chartData.prevClose
          : formattedData[formattedData.length - 1] > formattedData[0])

  return {
    data: formattedData,
    minValue: Math.min(chartData.prevClose || Number.MAX_VALUE, Math.min(...formattedData)),
    maxValue: Math.max(chartData.prevClose || Number.MIN_VALUE, Math.max(...formattedData)),
    klass: isTrendingUp ? 'quote-up' : 'quote-down'
  }
}

const makeHistoricalDataDriver = () => {
  return (sink$) => {
    logger.log("HistoricalDataDriver - Subscribing to sink: ", sink$)
    sink$.subscribe(chartData => {
      const type = 'line', // or candle
        metadata = parseData(chartData, type),
        prevClose = chartData.prevClose,
        margin = {top: 1, right: 1, bottom: 1, left: 1},
        width = chartData.width - margin.left - margin.right,
        height = chartData.height - margin.top - margin.bottom,
        x = d3.scale.linear()
          .domain([0, metadata.data.length])
          .range([0, width]),
        y = d3.scale.linear()
          .domain([metadata.minValue, metadata.maxValue])
          .range([height, 0]),
        line = d3.svg.line()
          .x((d, i) => x(i))
          .y(d => y(d)),
        horizLine = d3.svg.line()
          .x((d, i) => x(i * (metadata.data.length - 1)))
          .y(d => y(d))
      d3.selectAll(`${chartData.selector} > *`).remove()
      const svg = d3.select(chartData.selector)
          .append("svg")
          .attr('class', `chart ${type}`)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)
      if (chartData.displayPrevClose) {
        svg.append('path')
            .attr("class", "reference")
            .attr('d', horizLine([prevClose, prevClose]))
      }
      if (type === 'line') {
        svg.append('path')
            .attr("class", `line ${metadata.klass}`)
            .attr("d", line(metadata.data))
      } else if (type === 'candle') {
        const candleWidth = (width - margin.left - margin.right) / metadata.data.length
        const candleHeight = (d) =>
          Math.abs(y(Math.min(d.open_price, d.close_price)) - y(Math.max(d.open_price, d.close_price)))
        const candleClass = (d) => d.open_price < d.close_price ? 'quote-up' : 'quote-down'
        svg.selectAll("line.stem")
          .data(metadata.data)
          .enter()
          .append("line")
          .attr("class", "stem")
          .attr("x1", (d, i) => (i * candleWidth) + candleWidth / 2)
          .attr("x2", (d, i) => (i * candleWidth) + candleWidth / 2)
          .attr("y1", (d) => y(d.high_price))
          .attr("y2", (d) => y(d.low_price))
          .attr("stroke", (d) => 'black')

        svg.selectAll("rect")
          .data(metadata.data)
          .enter()
          .append("rect")
          .attr("class", (d) => `candle ${candleClass(d)}`)
          .attr("x", (d, i) => (i * candleWidth))
          .attr("y", (d) => y(Math.max(d.open_price, d.close_price)))
          .attr("width", (d) => candleWidth)
          .attr("height", (d) => candleHeight(d))
      }
    })
  }
}

export {makeHistoricalDataDriver, parseData}
