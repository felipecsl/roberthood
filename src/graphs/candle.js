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

/** returns a list of the indices of the data points representing the first day of each month */
const getTickValues = (data, inputTimeFormat) => {
  const dayTimeFormat = d3.time.format('%e')
  const monthTimeFormat = d3.time.format('%m')
  const yearTimeFormat = d3.time.format('%Y')
  const indices = []
  const formattedDates = data.map(d => inputTimeFormat.parse(d.begins_at))
    .map((d) => ({
      day: parseInt(dayTimeFormat(d).trim(), 10),
      month: parseInt(monthTimeFormat(d), 10),
      year: parseInt(yearTimeFormat(d), 10),
    }))
  formattedDates.forEach((d, i) => {
    if (i === 0 || d.month > formattedDates[i - 1].month || d.year > formattedDates[i - 1].year) {
      indices.push(i)
    }
  })

  return indices
}

const drawCandles = (svg, data, x, y, candleWidth) => {
  const candleHeight = (d) => Math.abs(
    y(Math.min(d.open_price, d.close_price)) - y(Math.max(d.open_price, d.close_price)))
  const candleClass = (d) => (d.open_price < d.close_price ? 'quote-up' : 'quote-down')
  const container = svg.append('g')
    .attr("class", "candlesContainer")
  container.selectAll('*').remove()
  container.selectAll("line.stem")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "stem")
    .attr("x1", (d, i) => x(i))
    .attr("x2", (d, i) => x(i))
    .attr("y1", (d) => y(d.high_price))
    .attr("y2", (d) => y(d.low_price))
    .attr("stroke", () => 'black')
    .attr("transform", () => `translate(${candleWidth / 2}, 0)`)
  container.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", (d) => `candle ${candleClass(d)}`)
    .attr("x", (d, i) => x(i))
    .attr("y", (d) => y(Math.max(d.open_price, d.close_price)))
    .attr("width", () => candleWidth)
    .attr("height", (d) => candleHeight(d))
}

const drawXAxis = (svg, xAxis, height) => {
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height - 20})`)
    .call(xAxis)
}

const drawYAxis = (svg, yAxis, containerWidth) => {
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${containerWidth - 30}, 0)`)
    .call(yAxis)
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

const onZoom = (svg, xAxis) => {
  svg.select(".x.axis").call(xAxis)
  svg.select('.candlesContainer').attr('transform', `translate(${d3.event.translate[0]},0)`)
}

const drawCandleChart = (chartData) => {
  const containerWidth = d3.select(chartData.selector).node().getBoundingClientRect().width
  logger.log(`width: ${containerWidth}`)
  const metadata = parseCandleData(chartData)
  const height = chartData.height
  const candleMargin = 1.5
  const minCandleWidth = 8
  const totalItems = metadata.data.length
  const candleWidth = minCandleWidth
  const inputTimeFormat = d3.time.format('%Y-%m-%dT%H:%M:%SZ')
  const xAxisOutputFormat = d3.time.format('%b/%y')
  // Label to be displayed on X axis by converting the data item into a formatted date
  const formatXAxis = (i) => {
    if (i >= 0 && i < totalItems) {
      const item = metadata.data[i]
      return xAxisOutputFormat(inputTimeFormat.parse(item.begins_at))
    }
    return ''
  }
  const tickValues = getTickValues(metadata.data, inputTimeFormat)
  const start = metadata.data[0].begins_at
  const end = metadata.data[totalItems - 1].begins_at
  logger.log(
    `start date: ${inputTimeFormat.parse(start)}, end date: ${inputTimeFormat.parse(end)}`)
  const x = d3.scale.linear()
    .domain([0, totalItems])
    .range([0, totalItems * (candleWidth + (candleMargin * 2))])
    .nice()
  const y = d3.scale.linear()
    .domain([metadata.minValue, metadata.maxValue])
    .range([height, 0])
    .nice()
  const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height)
    .tickValues(tickValues)
    .tickFormat(formatXAxis)
  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('right')
  const zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 1])
    .on('zoom', () => onZoom(svg, xAxis))
  d3.selectAll(`${chartData.selector} > *`).remove()
  const svgNode = d3.select(chartData.selector)
      .append("svg")
      .attr('class', `chart candle`)
      .attr("width", chartData.width)
      .attr("height", height)
      .call(zoom)
  const svg = svgNode.append('g')
  drawFill(svg)
  drawXAxis(svg, xAxis, height)
  drawYAxis(svg, yAxis, containerWidth)
  drawCandles(svg, metadata.data, x, y, candleWidth)
}

export { parseCandleData, drawCandleChart, getTickValues }
