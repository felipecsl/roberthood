import {
  div, 
  h1, 
  h2, 
  button, 
  h, 
  form, 
  a, 
  p
} from '@cycle/dom'
import {defined} from '../../../helpers'

const view = (sources, state$) => {
  const {router: { createHref }} = sources
  const portfolioHref = createHref(`/portfolio`)
  return state$.map(s => {
    const toast = Polymer.dom(document).querySelector('#toast')
    const errorMessage = (defined(s.error) && defined(s.error.non_field_errors)
      ? s.error.non_field_errors[0] : '')
    if (toast && errorMessage !== '') {
      toast.open()
    }
    const tokenPresent = s.token !== undefined
    return div([
      h('paper-toast', { attributes: { text: errorMessage, id: 'toast' } }),
      div(`${tokenPresent ? '.invisible' : '.visible'}`, [
        h('paper-card', { heading: 'Robert Hood', id: 'card' }, [
          h('.card-content', [
            form({ autocomplete: 'off' }, [
              h(`paper-input.username`, { label: 'Username'}),
              h(`paper-input.password`, { label: 'Password', type: 'password'})
            ])
          ]),
          h('.card-actions', [
            h(`paper-button.login`, `Login`)
          ])
        ])
      ]),
      div(`${tokenPresent ? '.visible' : '.invisible'}`, [
        h('paper-card', { heading: 'Robert Hood' }, [
          h('.card-content', [
            p("Logged in!"),
            a({ href: portfolioHref }, 'Go to Portfolio')
          ])
        ])
      ])
    ])
  })
}

export default view
