import {div, h1, h2, button, h, form} from '@cycle/dom'

const view = (state$) =>
  state$.map(({counter}) => {
    return div([
      form({autocomplete: 'off'}, [
        h(`paper-input.username`, { label: 'Username'}),
        h(`paper-input.password`, { label: 'Password', type: 'password'}),
        h(`paper-button.login`, { raised: 'true' }, `Login`),
      ]),
    ])
  }
  )

export default view
