import {run} from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {makeHistoryDriver} from 'cyclic-history'
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router'
import {createHashHistory} from 'history'
import {makeStateDriver} from './state-driver'
import {Observable} from 'rx'
import Main from './main'
import Pol from './polymer'
import d3 from 'd3'

function makeHistoricalDataDriver() {
  return function historicalDataDriver(sink$) {
    sink$.subscribe(chartData => {
      chartData.data$.subscribe(h => {
        let prevClose = 0
        let data = []
        if (h.adjusted_equity_previous_close !== undefined) {
          // Portfolio historicals
          prevClose = parseFloat(h.adjusted_equity_previous_close)
          data = h.map(d => [d.adjusted_open_equity, d.adjusted_close_equity])
            .reduce((a, b) => a.concat(b), [])
            .map(d => parseFloat(d))
        } else {
          // Quote historicals
          // TODO: Find a way to get prevClose for Quotes
          prevClose = chartData.prevClose
          data = h.map(d => (parseFloat(d.open_price) + parseFloat(d.close_price)) / 2)
            .reduce((a, b) => a.concat(b), [])
            .map(d => parseFloat(d))
        }
        const klass = data[data.length - 1] > prevClose ? 'quote-up' : 'quote-down'
        const margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = chartData.width - margin.left - margin.right,
            height = chartData.height - margin.top - margin.bottom
        const x = d3.scale.linear()
            .domain([0, data.length])
            .range([0, width])
        const y = d3.scale.linear()
            .domain([Math.min(prevClose, Math.min(...data)), Math.max(prevClose, Math.max(...data))])
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
        const svg = d3.select(chartData.selector)
            .append("svg")
            .attr('class', 'chart')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
        svg.append('path')
              .attr("class", "reference")
              .attr('d', horizLine([prevClose, prevClose]))
        svg.append('path')
            .attr("class", `line ${klass}`)
            .attr("d", line(data))
      })
    })
    return Observable.empty()
  }
}

app.addEventListener('dom-change', () => {
  // This is the Cycle run. first argument is our mainApp then an object:
  // DOM is the ID or class we want the cycle to render onto our page.
  // History is using our makeHistoryDriver to deal with routing.

  console.log("Initializing Cycle...")

  const sources = {
    DOM: makeDOMDriver(`#application`),
    HTTP: makeHTTPDriver(),
    historicalData: makeHistoricalDataDriver(),
    router: makeRouterDriver(makeHistoryDriver(createHashHistory())),
    state$: makeStateDriver(),
  }

  run(Main, sources)
})
