// homeIntent creates streams from click events on .increment & .decrement
const homeIntent = s => ({
  inc$: s.DOM.select(`.increment`).events(`click`).map(() => +1),
  dec$: s.DOM.select(`.decrement`).events(`click`).map(() => -1),
})
export default homeIntent
