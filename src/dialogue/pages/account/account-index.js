import view from './account-view'
import {Observable} from 'rx'

const Account = (sources) => {
  const {state$} = sources
  const view$ = view(state$)
  return {
    DOM: view$,
    HTTP: Observable.empty(),
    state$: sources.state$,
    historicalData: sources.historicalData
  }
}

export default Account
