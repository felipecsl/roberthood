import {div, p} from '@cycle/dom'

const view = state$ => {
  return state$.map(({user}) => {
    return div([
      p([`Username: ${user.username}`]),
      p([`First Name: ${user.first_name}`]),
      p([`Last Name: ${user.last_name}`]),
      p([`Email Name: ${user.email}`])
    ])
  })
}

export default view
