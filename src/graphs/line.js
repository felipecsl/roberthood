import d3 from 'd3'

const formatLineData = (data) => data
  .map(d => [d.open_price, d.close_price])
  .reduce((a, b) => a.concat(b), [])
  .map(d => parseFloat(d))

const parseLineData = (chartData) => {
  const formattedData = formatLineData(chartData.data)
  const isTrendingUp = (chartData.displayPrevClose
          ? formattedData[formattedData.length - 1] > chartData.prevClose
          : formattedData[formattedData.length - 1] > formattedData[0])

  return {
    data: formattedData,
    minValue: Math.min(chartData.prevClose || Number.MAX_VALUE, Math.min(...formattedData)),
    maxValue: Math.max(chartData.prevClose || Number.MIN_VALUE, Math.max(...formattedData)),
    klass: isTrendingUp ? 'quote-up' : 'quote-down',
  }
}

const drawLineChart = (chartData) => {
  const metadata = parseLineData(chartData)
  const prevClose = chartData.prevClose
  const width = chartData.width
  const height = chartData.height
  const x = d3.scale.linear()
      .domain([0, metadata.data.length])
      .range([0, width])
  const y = d3.scale.linear()
      .domain([metadata.minValue, metadata.maxValue])
      .range([height, 0])
  const line = d3.svg.line()
      .x((d, i) => x(i))
      .y(d => y(d))
  const horizLine = d3.svg.line()
      .x((d, i) => x(i * (metadata.data.length - 1)))
      .y(d => y(d))
  d3.selectAll(`${chartData.selector} > *`).remove()
  const svg = d3.select(chartData.selector)
      .append("svg")
      .attr('class', `chart line`)
      .attr("width", chartData.width)
      .attr("height", height)
      .append("g")
      .attr('transform', 'translate(0,0)')
      .append('g')
  if (chartData.displayPrevClose) {
    svg.append('path')
        .attr("class", "reference")
        .attr('d', horizLine([prevClose, prevClose]))
  }
  svg.append('path')
      .attr("class", `line ${metadata.klass}`)
      .attr("d", line(metadata.data))
}

export { parseLineData, drawLineChart }
