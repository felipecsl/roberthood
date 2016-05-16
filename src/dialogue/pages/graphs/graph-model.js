const model = (state$, props$) => props$
  .take(1)
  .flatMap(p => state$.take(1).map(s => {
    const newState = s
    newState.currentInstrument = p.id
    return newState
  }))

export default model
