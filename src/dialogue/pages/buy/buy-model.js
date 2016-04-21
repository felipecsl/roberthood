import {Observable} from 'rx'

const model = (state$, props$) => props$.take(1)
  .flatMap(p => state$.take(1).map(s => {
    s.currentInstrument = p.id
    return s
  }))

export default model
