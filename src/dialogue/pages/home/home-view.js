import {div, h1, h2, button, h, form, a} from '@cycle/dom'

const view = (sources, state$) => {
  const {router: {createHref}} = sources
  const portfolioHref = createHref(`/portfolio`)
  return state$.map(s => {
    if (s.token === undefined) {
      return div([
        h(`p`, s),
        form({autocomplete: 'off'}, [
          h(`paper-input.username`, { label: 'Username'}),
          h(`paper-input.password`, { label: 'Password', type: 'password'}),
          h(`paper-button.login`, { raised: 'true' }, `Login`)
        ]),
      ])
    } else {
      // render post login UI or redirect somewhere else?
      return div([
        h1(`Logged in!`),
        a(`.something`, {href: portfolioHref}, [`Portfolio`]),
      ])
    }
  })
}
export default view
