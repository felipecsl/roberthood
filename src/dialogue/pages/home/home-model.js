import {Observable} from 'rx'

const homeModel = (response$) => {
  return response$
      .flatMap(x => x)
      .map(res => res.body)
      .share()
      .startWith({})
}

export default homeModel
