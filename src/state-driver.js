function makeStateDriver(stateStore = {}) {
  return function stateDriver(sink$) {
    return sink$.scan((prev, curr) => {
      if (!curr || typeof curr !== `object`) {
        throw new TypeError(`state must be an object`)
      }
      return Object.assign(prev, curr)
    }, stateStore)
    .share()
  }
}

export {makeStateDriver}
