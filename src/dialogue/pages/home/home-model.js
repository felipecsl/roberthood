import {Observable} from 'rx'

const homeModel = (request$, state$) => {
  return Observable.merge(state$.take(1),
    request$.flatMap(x => x)
      .map(res => res.body)
      .catch(e => Observable.just(e.response.text)))
}

export default homeModel
