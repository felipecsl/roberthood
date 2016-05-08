import {Observable} from 'rx'
import logger from './logger'

export const makeGlobalActionsDriver = () => {
  return (sink$) => {
    sink$.subscribe(s => {
      logger.log("GlobalActionsDriver - event:", s)
    })

    return Observable.fromEvent(document.querySelector("#btn-refresh"), 'click')
      .doOnNext(s => logger.log("GlobalActionsDriver - onClickRefresh()"))
      .share()
  }
}
