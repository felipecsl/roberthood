import {div, h1, h2} from '@cycle/dom'

const view = state$ => {
  return state$.map(s => {
    return div(`.page1`,[
      h1(`.content-subhead`, [`Page 1`]),
      h1([`Portfolio`]),
      h2([`Counter: `]),
    ])
  })
}

export default view
