function makeStateDriver(stateStore = {}) {
  return function stateDriver(sink$) {
    const source$ = sink$
      .scan((prev, curr) => {
        if (!curr || typeof curr !== `object`) {
          throw new TypeError(`state must be an object`)
        }
        return Object.assign(prev, curr)
      }, stateStore)
      .replay(null, 1)
    source$.connect()
    return source$
  }
}

export {makeStateDriver}
