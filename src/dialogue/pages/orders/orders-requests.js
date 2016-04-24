import {Observable} from 'rx'

export default (model$) => model$.filter(m => m.token !== undefined && m.orders === undefined)
  .take(1)
  .flatMap(({token}) => Observable.just({
    method: 'GET',
    eager: true,
    url: `/orders?token=${token}`,
    category: 'orders',
  }))
