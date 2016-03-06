import {div, h1, h2, button, h, form} from '@cycle/dom'

const view = (state$) =>
  state$.map(s => {
    if (s.token === undefined) {
      return div([
        h(`p`, s),
        form({autocomplete: 'off'}, [
          h(`paper-input.username`, { label: 'Username'}),
          h(`paper-input.password`, { label: 'Password', type: 'password'}),
          h(`paper-button.login`, { raised: 'true' }, `Login`),
        ]),
      ])
    } else {
      // render post login UI or redirect somewhere else?
      return h1(`Logged in! Token= ${s.token}`)
    }
  })

export default view
