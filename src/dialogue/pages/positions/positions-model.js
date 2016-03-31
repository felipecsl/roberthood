import {Observable} from 'rx'

const model = (props$) => {
  return props$.take(1)
}

export default model
