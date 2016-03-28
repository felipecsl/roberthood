import {toFixed} from 'accounting'

const CLASS_QUOTE_UP = ".quote-up"
const CLASS_QUOTE_DOWN = ".quote-down"
const helpers = {
  /**
   * Formats the number of shares amount as an Integer. Eg.: "2.000" -> "2"
   */
  formatShares: (amount) => {
    return amount.substring(0, amount.indexOf("."))
  },

  /**
   * Returns the CSS class name to be used for displaying the provided quote based on whether
   * it is going up or down
   */
  quoteClass: (quote) => {
    return parseFloat(quote.last_trade_price) > parseFloat(quote.previous_close)
      ? CLASS_QUOTE_UP : CLASS_QUOTE_DOWN
  },

  /**
   * Returns the CSS class name to be used for displaying the provided portfolio based on
   * whether it is going up or down.
   */
  equityClass: (portfolio) => {
    return parseFloat(portfolio.last_core_equity) > parseFloat(portfolio.equity_previous_close)
      ? CLASS_QUOTE_UP : CLASS_QUOTE_DOWN
  },

  /**
   * Returns true if the provided model object is already fully loaded and ready
   * to be displayed in the UI
   */
  isFullyLoaded: (m) => {
    return m.positions !== undefined && m.positions.map(p => p.instrument)
      .every(i => i.symbol !== undefined
        && i.quote !== undefined
        && i.quote.last_trade_price !== undefined)
  },

  /**
   * Returns a String percentage change for the provided quote
   */
  quotePercentChangeStr: (quote) => {
    const absChange = quote.last_trade_price - quote.previous_close
    return toFixed((absChange / quote.last_trade_price) * 100, 2)
  }
}

export default helpers
