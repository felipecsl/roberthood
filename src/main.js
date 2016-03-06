import {Observable} from 'rx'
import navbar from './dialogue/components/navbar/navbar-index'
import ContentRouter from './dialogue/components/content-router/content-router-index'
// @cycle/dom has a hyperscript-helper built in so you can
// declare all html elements you are going to use like div, h1, h2, nav etc
import {div, h1} from '@cycle/dom'

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
      sources.DOM.select('.username')
        .observable
        .flatMap(x => x)
        .map(e => e.value)
        .take(1),
      sources.DOM.select('.password')
        .observable
        .flatMap(x => x)
        .map(e => e.value)
        .take(1), (u, p) => ({
          username: u,
          password: p
    })))
    .filter(data => data.username.length > 0)
    .filter(data => data.password.length > 0)
    .map(data => ({
      url: '/auth',
      method: 'POST',
      type: 'application/x-www-form-urlencoded',
      send: Object.keys(data).map(k => k + '=' + data[k]).join('&')
    }));
  const view$ = sources.HTTP
    .flatMap(x => x)
    .map(res => res.body.token)
    .startWith("")
    .map(result => h1(`.token`, result))
    .catch(e => Observable.just(h1(`.error`, e.response.text)))
    .merge(Content.DOM);

  return {
    DOM: view$,
    HTTP: loginRequest$,
    state$: state$.startWith({}),
  }
}

export default main
