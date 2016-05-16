import QuoteHistoricalData from '../../../models/quote-historical-data'

export default (model$, dataInterval$) =>
  QuoteHistoricalData.streamCurrentInstrument$(model$, dataInterval$)
