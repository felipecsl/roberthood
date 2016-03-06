import {div, h1, h2} from '@cycle/dom'

const view = state$ => {
  return state$.map(({counter}) => {
    return div(`.page1`,[
      h1(`.content-subhead`, [`Page 1`]),
      h1([`Portfolio`]),
      h2([`Counter: ` + counter]),
    ])
  })
}

export default view
