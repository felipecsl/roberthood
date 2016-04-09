import view from './home-view'
import intent from './home-intent'
import model from './home-model'

const Home = (sources) => {
  const {state$} = sources
  const actions = intent(sources)
  const token$ = model(sources)
  const request$ = actions.map(data => ({
    url: '/auth',
    method: 'POST',
    eager: true,
    type: 'application/x-www-form-urlencoded',
    send: Object.keys(data).map(k => k + '=' + encodeURIComponent(data[k])).join('&')
  }))

  return {
    DOM: view(sources, token$),
    HTTP: request$,
    state$: token$,
    historicalData: sources.historicalData
  }
}

export default Home
