import {Observable} from 'rx'
import {div, p, h, h1, ul, li, a} from '@cycle/dom'

const view = (state$, router) => {
  return state$.map(s => h1(s.id))
}

export default view
