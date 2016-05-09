const logger = ({
  log: function (val) {
    const enabled = true
    if (enabled) {
      console.log(...arguments)
    }
  }
})

export default logger
