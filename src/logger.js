const logger = ({
  log() {
    const enabled = true
    if (enabled) {
      console.log(...arguments)
    }
  }
})

export default logger
