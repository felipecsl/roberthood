import {Observable} from 'rx'

const homeModel = (sources) => {
  return Observable.merge(sources.state$.take(1), sources.HTTP
      .flatMap(x$ => x$.catch(err => {
        console.log("Request failed. ")
        return Observable.just(({ body: {
          error: err.response.body
        }}))
      }))
      .map(res => res.body)
      .share())
}

export default homeModel
