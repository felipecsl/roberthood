import {Observable} from 'rx'
import d3 from 'd3'

function makeHistoricalDataDriver() {
  return function historicalDataDriver(sink$) {
    sink$.subscribe(chartData => {
      chartData.data$.subscribe(h => {
        let prevClose = 0
        let data = []
        if (chartData.equityPrevClose !== undefined) {
          // Portfolio historicals
          prevClose = parseFloat(chartData.equityPrevClose)
          data = h.map(d => [d.adjusted_open_equity, d.adjusted_close_equity])
            .reduce((a, b) => a.concat(b), [])
            .map(d => parseFloat(d))
        } else {
          // Quote historicals
          prevClose = chartData.prevClose
          data = h.map(d => (parseFloat(d.open_price) + parseFloat(d.close_price)) / 2)
            .reduce((a, b) => a.concat(b), [])
            .map(d => parseFloat(d))
        }
        const margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = chartData.width - margin.left - margin.right,
            height = chartData.height - margin.top - margin.bottom
        const minValue = Math.min(prevClose, Math.min(...data))
        const maxValue = Math.max(prevClose, Math.max(...data))
        const isTrendingUp = (chartData.displayPrevClose ? data[data.length - 1] > prevClose
          : data[data.length - 1] > data[0])
        const klass = isTrendingUp ? 'quote-up' : 'quote-down'
        const x = d3.scale.linear()
            .domain([0, data.length])
            .range([0, width])
        const y = d3.scale.linear()
            .domain([minValue, maxValue])
            .range([height, 0])
        const xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
        const yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
        const line = d3.svg.line()
            .x((d, i) => x(i))
            .y(d => y(d))
        const horizLine = d3.svg.line()
            .x((d, i) => x(i * (data.length - 1)))
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
            .attr("class", `line ${klass}`)
            .attr("d", line(data))
      })
    })
    return Observable.empty()
  }
}

export {makeHistoricalDataDriver}
