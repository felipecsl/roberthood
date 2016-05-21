import d3 from 'd3'
import logger from '../logger'

const formatCandleData = (data) => data.map(d => ({
  begins_at: d.begins_at,
  open_price: parseFloat(d.open_price),
  close_price: parseFloat(d.close_price),
  high_price: parseFloat(d.high_price),
  low_price: parseFloat(d.low_price),
  volume: d.volume,
  interpolated: d.interpolated,
}))

const parseCandleData = (chartData) => {
  const formattedData = formatCandleData(chartData.data)
  const isTrendingUp = (chartData.displayPrevClose
          ? formattedData[formattedData.length - 1].open_price > chartData.prevClose
          : formattedData[formattedData.length - 1].close_price > formattedData[0].close_price)

  return {
    data: formattedData,
    minValue: Math.min(chartData.prevClose || Number.MAX_VALUE,
      Math.min(...formattedData.map(d => Math.min(d.open_price, d.close_price)))),
    maxValue: Math.max(chartData.prevClose || Number.MIN_VALUE,
      Math.max(...formattedData.map(d => Math.max(d.open_price, d.close_price)))),
    klass: isTrendingUp ? 'quote-up' : 'quote-down',
  }
}

/** Draws a solid gray rectangle in the svg so the candle chart can be dragged around */
const drawFill = (svg) => {
  const g = svg.selectAll('g.fill-group')
    .data(['1'])
  g.enter().append('g')
      .attr('class', 'fill-group')
  const fill = g.selectAll('.fill')
    .data(['1'])
  fill.enter().append('rect')
      .attr('class', 'fill')
      .attr('width', '100%')
      .attr('height', '100%')
}

const drawCandleChart = (chartData) => {
  const metadata = parseCandleData(chartData)
  const height = chartData.height
  const candleMargin = 2
  const minCandleWidth = 6
  const totalItems = metadata.data.length
  const candleWidth = minCandleWidth
  const stringifyDatetime = d3.time.format('%Y-%m-%dT%H:%M:%SZ')
  const parseDatetime = stringifyDatetime.parse
  const formatXAxis = d3.time.format('%b/%y')
  const start = metadata.data[0].begins_at
  const end = metadata.data[totalItems - 1].begins_at
  const getX = (d) => parseDatetime(d.begins_at)
  logger.log(`start: ${parseDatetime(start)}, end: ${parseDatetime(end)}`)
  const x = d3.time.scale()
    .domain([parseDatetime(start), parseDatetime(end)])
    .range([0, totalItems * ((candleWidth * 2) + candleMargin)])
    .nice()
  const y = d3.scale.linear()
    .domain([metadata.minValue, metadata.maxValue])
    .range([height, 0])
    .nice()
  const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height)
    .tickFormat(formatXAxis)
  const onZoom = () => {
    svg.select(".x.axis").call(xAxis)
    candlesContainer.attr('transform', `translate(${d3.event.translate[0]},0)`)
  }
  const zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 1])
    .on('zoom', onZoom)
  const candleHeight = (d) => Math.abs(
    y(Math.min(d.open_price, d.close_price)) - y(Math.max(d.open_price, d.close_price)))
  const candleClass = (d) => (d.open_price < d.close_price ? 'quote-up' : 'quote-down')
  const drawCandles = (candlesContainer) => {
    candlesContainer.selectAll('*').remove()
    candlesContainer.selectAll("line.stem")
      .data(metadata.data)
      .enter()
      .append("line")
      .attr("class", "stem")
      .attr("x1", (d) => x(getX(d)))
      .attr("x2", (d) => x(getX(d)))
      .attr("y1", (d) => y(d.high_price))
      .attr("y2", (d) => y(d.low_price))
      .attr("stroke", () => 'black')
      .attr("transform", () => `translate(${candleWidth / 2}, 0)`)
    candlesContainer.selectAll("rect")
      .data(metadata.data)
      .enter()
      .append("rect")
      .attr("class", (d) => `candle ${candleClass(d)}`)
      .attr("x", (d) => x(getX(d)))
      .attr("y", (d) => y(Math.max(d.open_price, d.close_price)))
      .attr("width", () => candleWidth)
      .attr("height", (d) => candleHeight(d))
  }
  d3.selectAll(`${chartData.selector} > *`).remove()
  const svgNode = d3.select(chartData.selector)
      .append("svg")
      .attr('class', `chart candle`)
      .attr("width", chartData.width)
      .attr("height", height)
      .call(zoom)
  const svg = svgNode.append('g')
  drawFill(svg)
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height - 25})`)
    .call(xAxis)
  const candlesContainer = svg.append('g')
  drawCandles(candlesContainer)
}

export { parseCandleData, drawCandleChart }
