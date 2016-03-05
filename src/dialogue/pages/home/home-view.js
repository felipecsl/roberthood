import {div, h1, h2, button, h} from '@cycle/dom'

const view = (state$) =>
  // mapping over our merged model to update 'count'
  state$.map(({counter}) => {
    return div(`.homepage`, [
      div([
        div([
          h(`p`, `Counter: ` + counter),
        ]),
        h(`paper-input.username`, { label: 'Username'}),
        h(`paper-input.password`, { label: 'Password', type: 'password'}),
        h(`paper-button.login`, { raised: 'true' }, `Login`),
      ]),
    ])
  }
  )

export default view
