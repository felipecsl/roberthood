import {Observable} from 'rx'
import d3 from 'd3'

/** Exposed for unit tests */
const parseData = (chartData) => {
  const formattedData = chartData.data
    .map(d => [d.open_price, d.close_price])
    .reduce((a, b) => a.concat(b), [])
    .map(d => parseFloat(d)),
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
    sink$.subscribe(chartData => {
      const metadata = parseData(chartData),
        prevClose = chartData.prevClose,
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = chartData.width - margin.left - margin.right,
        height = chartData.height - margin.top - margin.bottom,
        x = d3.scale.linear()
          .domain([0, metadata.data.length])
          .range([0, width]),
        y = d3.scale.linear()
          .domain([metadata.minValue, metadata.maxValue])
          .range([height, 0]),
        xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom"),
        yAxis = d3.svg.axis()
          .scale(y)
          .orient("left"),
        line = d3.svg.line()
          .x((d, i) => x(i))
          .y(d => y(d)),
        horizLine = d3.svg.line()
          .x((d, i) => x(i * (metadata.data.length - 1)))
          .y(d => y(d))
      d3.selectAll(`${chartData.selector} > *`).remove()
      const svg = d3.select(chartData.selector)
          .append("svg")
          .attr('class', 'chart')
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)
      if (chartData.displayPrevClose) {
        svg.append('path')
            .attr("class", "reference")
            .attr('d', horizLine([prevClose, prevClose]))
      }
      svg.append('path')
          .attr("class", `line ${metadata.klass}`)
          .attr("d", line(metadata.data))
    })
    return Observable.empty()
  }
}

export {makeHistoricalDataDriver, parseData}
