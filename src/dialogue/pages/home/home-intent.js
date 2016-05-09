import {Observable} from 'rx'
// homeIntent creates streams from login button click events
const homeIntent = sources => {
  return sources.DOM.select('.login')
    .events('click')
    .debounce(500)
    .do(s => console.log('HOME INTENT - login button clicked'))
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
        .take(1),
      (u, p) => ({
        username: u,
        password: p
      })
    ))
    .filter(data => data.username.length > 0)
    .filter(data => data.password.length > 0)
}
export default homeIntent
