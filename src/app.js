import {run} from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {makeHistoryDriver} from 'cyclic-history'
import {makeRouterDriver} from 'cyclic-router'
import {createHashHistory} from 'history'
import {makeStateDriver} from './state-driver'
import Main from './main'
import Pol from './polymer'

app.addEventListener('dom-change', function() {
  // This is the Cycle run. first argument is our mainApp then an object:
  // DOM is the ID or class we want the cycle to render onto our page.
  // History is using our makeHistoryDriver to deal with routing.
  const sources = {
    DOM: makeDOMDriver(`#application`),
    router: makeRouterDriver(makeHistoryDriver(createHashHistory())),
    state$: makeStateDriver(),
  }

  run(Main,sources)
})
