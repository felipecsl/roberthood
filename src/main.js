import {Observable} from 'rx'
import navbar from './dialogue/components/navbar/navbar-index'
import ContentRouter from './dialogue/components/content-router/content-router-index'
import {h1} from '@cycle/dom'
// @cycle/dom has a hyperscript-helper built in so you can
// declare all html elements you are going to use like div, h1, h2, nav etc
import {div} from '@cycle/dom'

// view is what we'd like to display in this case our sidebar + content all wrapped in a div
const view = (nav, content) => {
  return div(`#layout`, [
    div(div(`.header`, [nav])),
    div([content]),
  ])
}

// we need to pass our components to cycle and give them a "source" when they come from cycle
// creating this "cycle", here you can see that view$ is a Rx Observable containing out "view"
// we pass view our nav.DOM + Content.DOM which you can see in const view above become available
// variables. We return all of this in an Object with DOM + History
function main(sources) {
  const Content = ContentRouter(sources)
  const {path$, state$} = Content
  const Nav = navbar(sources, path$)
  const loginRequest$ = sources.DOM.select('.login')
    .events('click')
    .debounce(500)
    .flatMap(ev => Observable.zip(
      sources.DOM.select('.username').observable.flatMap(x => x).map(e => e.value).take(1),
      sources.DOM.select('.password').observable.flatMap(x => x).map(e => e.value).take(1),
      (u, p) => ({
        username: u,
        password: p
    })))
    .doOnNext(e => console.log(e))
    .filter(data => data.username.length > 0)
    .filter(data => data.password.length > 0)
    .map(data => ({
      url: 'https://api.robinhood.com/api-token-auth/',
      method: 'POST',
      field: ({
        username: data.username,
        password: data.password
      }),
      headers: ({
        'X-Robinhood-API-Version': '1.60.1',
        'User-Agent': 'okhttp/3.2.0'
      })
    }));
  const view$ = sources.HTTP
    .flatMap(x => x)
    .map(res => res.body.token)
    .startWith("")
    .map(result =>
      h1(`.token`, result)
    )
    .merge(Content.DOM);

  return {
    DOM: view$,
    HTTP: loginRequest$,
    state$: state$.startWith({counter: 0}),
  }
}

export default main
