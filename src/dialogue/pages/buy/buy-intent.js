const intent = ({DOM}) => DOM.select('.shares')
  .events('input')
  .debounce(500)
  .map(e => parseInt(e.target.value))
  .startWith(1)

export default intent
