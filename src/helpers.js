const CLASS_QUOTE_UP = ".quote-up"
const CLASS_QUOTE_DOWN = ".quote-down"
/**
 * Formats the number of shares amount as an Integer. Eg.: "2.000" -> "2"
 */
export const formatShares = (amount) => amount.substring(0, amount.indexOf("."))

/**
 * Returns the CSS class name to be used for displaying the provided portfolio based on
 * whether it is going up or down.
 */
export const chartClass = (absChange) => (absChange >= 0 ? CLASS_QUOTE_UP : CLASS_QUOTE_DOWN)

export const instrumentIdFromUrl = (url) =>
  url.replace("https://api.robinhood.com/instruments/", "").replace("/", "")

export const isLoggedIn = (m) => m.token !== undefined

/**
 * Returns true if the provided model object is already fully loaded and ready
 * to be displayed in the UI
 */
export const isFullyLoaded = (m) => m.positions !== undefined && m.positions.map(p => p.instrument)
    .every(i => i.symbol !== undefined
      && i.quote !== undefined
      && i.quote.last_trade_price !== undefined)

export const defined = (s) => s !== undefined

// Historical data span (either intraday or daily)
export const interval = (i) => {
  if (i === 'ALL') {
    return 'week'
  }
  return i === '1D' ? '5minute' : 'day'
}

export const span = (i) => {
  if (i === 'ALL') {
    return '5year'
  }
  return i === '1D' ? 'day' : 'year'
}
