import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'
import { makeRouterDriver } from 'cyclic-router'
import { createHashHistory } from 'history'
import { makeStateDriver } from './state-driver'
import { makeHistoricalDataDriver } from './historical-data-driver'
import { makeGlobalActionsDriver } from './global-actions-driver'
import Main from './main'
import logger from './logger'

// This is the Cycle run. first argument is our mainApp then an object:
// DOM is the ID or class we want the cycle to render onto our page.
// History is using our makeHistoryDriver to deal with routing.

HTMLImports.whenReady(function () {
  logger.log("Initializing Cycle...")
  
  const sources = {
    DOM: makeDOMDriver(`#application`),
    HTTP: makeHTTPDriver(),
    historicalData: makeHistoricalDataDriver(),
    router: makeRouterDriver(createHashHistory()),
    state$: makeStateDriver(),
    globalActions$: makeGlobalActionsDriver(),
  }

  run(Main, sources)
})
