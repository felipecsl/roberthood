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

  return {
    DOM: Content.DOM,
    HTTP: Content.HTTP,
    state$: state$.startWith({user: ({}) }),
  }
}

export default main
