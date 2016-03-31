import {run} from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {makeHistoryDriver} from 'cyclic-history'
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router'
import {createHashHistory} from 'history'
import {makeStateDriver} from './state-driver'
import {makeHistoricalDataDriver} from './historical-data-driver'
import Main from './main'
import Pol from './polymer'

// This is the Cycle run. first argument is our mainApp then an object:
// DOM is the ID or class we want the cycle to render onto our page.
// History is using our makeHistoryDriver to deal with routing.

console.log("Initializing Cycle...")

const sources = {
  DOM: makeDOMDriver(`#application`),
  HTTP: makeHTTPDriver(),
  historicalData: makeHistoricalDataDriver(),
  router: makeRouterDriver(createHashHistory()),
  state$: makeStateDriver(),
}

run(Main, sources)
