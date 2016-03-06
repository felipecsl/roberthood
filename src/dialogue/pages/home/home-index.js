import view from './home-view'
import intent from './home-intent'
import model from './home-model'

const Home = (sources) => {
  const {state$} = sources
  const actions = intent(sources)
  const state$$ = model(sources.HTTP, state$)
  const request$ = actions.map(data => ({
    url: '/auth',
    method: 'POST',
    type: 'application/x-www-form-urlencoded',
    send: Object.keys(data).map(k => k + '=' + data[k]).join('&')
  }))

  return {
    DOM: view(state$$),
    HTTP: request$,
    state$: state$$,
  }
}

export default Home
