import {Observable} from 'rx'

const homeModel = (sources) => {
  return Observable.merge(sources.state$.take(1), sources.HTTP
      .flatMap(x => x)
      .map(res => res.body)
      .share()
      .doOnNext(({token}) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem("token", token)
        }
      }))
}

export default homeModel
