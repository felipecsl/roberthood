import {Observable} from 'rx'

const portfolioModel = (request$, state$) => {
  return Observable.merge(state$.take(1),
    request$.flatMap(x => x)
      .map(res => ({user: res.body}))
      .catch(e => Observable.just(e.response.text)))
}

export default portfolioModel
