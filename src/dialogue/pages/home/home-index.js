import view from './home-view'
import intent from './home-intent'
import model from './home-model'

const Home = (sources) => {
  console.log('Home#index')
  const actions = intent(sources).do(s => console.log("HOME INDEX - onLogin"))
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
    historicalData: sources.historicalData,
    globalActions$: sources.globalActions$
  }
}

export default Home
