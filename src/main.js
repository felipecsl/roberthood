import ContentRouter from './dialogue/components/content-router/content-router-index'
import logger from './logger'
import moment from 'moment'

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value))
}

Storage.prototype.getObject = function(key) {
  const value = this.getItem(key)
  return value && JSON.parse(value)
}

// we need to pass our components to cycle and give them a "source" when they come from cycle
// creating this "cycle", here you can see that view$ is a Rx Observable containing out "view"
// we pass view our nav.DOM + Content.DOM which you can see in const view above become available
// variables. We return all of this in an Object with DOM + History
function main(sources) {
  const Content = ContentRouter(sources)

  let state = window.localStorage.getObject("state")
  if (state === 'undefined' || state === null) {
    state = {}
  }

  const persistState = (s) => {
    if (typeof window !== 'undefined' && s !== undefined) {
      if (s.error) {
        // delete transient error messages
        delete s.error
      }
      logger.log("MAIN - saving new state with=", s)
      window.localStorage.setObject("state", s)
    }
  }

  // Since we treat the state as a hot Observable, we need to delay its initial state a little bit
  // until the entire chain is set up, otherwise it will be emitted before we had a chance to
  // see it.
  const state$ = Content.state$.doOnNext(persistState)
    .startWith(state)
    .delay(moment().add(100, 'millisecond').toDate())

  return {
    DOM: Content.DOM,
    HTTP: Content.HTTP,
    historicalData: Content.historicalData,
    globalActions$: Content.globalActions$,
    state$,
  }
}

export default main
