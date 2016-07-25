const intent = (dom) => dom.select('.chart-interval')
  .events('click')
  .map(ev => `${ev.target.textContent}`)
  .startWith('1D')

export default intent
